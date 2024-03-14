import { Injectable } from '@nestjs/common'
import { OrderRepository } from '@order/repositories/order.repository'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { OrderStatus, TransactionStatus, UserRole } from '@common/contracts/constant'
import { CancelOrderDto, CreateOrderDto } from '@order/dto/order.dto'
import { ClientSession, Connection, FilterQuery } from 'mongoose'
import { Order, OrderHistoryDto } from '@order/schemas/order.schema'
import { SuccessResponse } from '@common/contracts/dto'
import { AppException } from '@src/common/exceptions/app.exception'
import { Errors } from '@src/common/contracts/error'
import { CartService } from '@cart/services/cart.service'
import { InjectConnection } from '@nestjs/mongoose'
import { ProductRepository } from '@product/repositories/product.repository'
import { PaymentRepository } from '@payment/repositories/payment.repository'
import { PaymentMethod } from '@payment/contracts/constant'
import { PaymentService } from '@payment/services/payment.service'
import { CreateMomoPaymentDto, CreateMomoPaymentResponse } from '@payment/dto/momo-payment.dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class OrderService {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly orderRepository: OrderRepository,
    private readonly paymentService: PaymentService,
    private readonly paymentRepository: PaymentRepository,
    private readonly cartService: CartService,
    private readonly productRepository: ProductRepository,
    private readonly configService: ConfigService
  ) {}

  public async getOrderList(filter: FilterQuery<Order>, paginationParams: PaginationParams) {
    const result = await this.orderRepository.paginate(
      {
        ...filter,
        transactionStatus: {
          $in: [
            TransactionStatus.CAPTURED,
            TransactionStatus.CANCELED,
            TransactionStatus.REFUNDED
          ]
        },
        status: {
          $ne: OrderStatus.DELETED
        }
      },
      {
        projection: '+items',
        ...paginationParams
      }
    )
    return result
  }

  public async getOrderDetails(filter: FilterQuery<Order>) {
    const order = await this.orderRepository.findOne({
      conditions: {
        ...filter,
        transactionStatus: {
          $in: [
            TransactionStatus.CAPTURED,
            TransactionStatus.CANCELED,
            TransactionStatus.REFUNDED
          ]
        },
        status: {
          $ne: OrderStatus.DELETED
        }
      },
      projection: '+items'
    })
    if (!order) throw new AppException(Errors.ORDER_NOT_FOUND)

    return order
  }

  public async getOrderHistory(customerId: string, orderId: string) {
    const order = await this.orderRepository.findOne({
      conditions: {
        _id: orderId,
        'customer._id': customerId,
        status: { $ne: OrderStatus.DELETED }
      },
      projection: {
        orderHistory: {
          orderStatus: 1,
          transactionStatus: 1,
          timestamp: 1
        }
      }
    })

    if (!order) throw new AppException(Errors.ORDER_NOT_FOUND)

    return order.orderHistory
  }

  public async createOrder(createOrderDto: CreateOrderDto) {
    // Execute in transaction
    const session = await this.connection.startSession()
    session.startTransaction()
    try {
      // 1. Fetch product in cart items
      const { items } = await this.cartService.getCart(createOrderDto.customer?._id)
      if (items.length === 0) throw new AppException(Errors.CART_EMPTY)
      const cartItems = items

      let totalAmount = 0
      let orderItems = createOrderDto.items

      orderItems = orderItems.map((orderItem) => {
        // 2. Check valid dto with cartItems
        const index = cartItems.findIndex((cartItem) => {
          return cartItem.productId == orderItem.productId && cartItem.sku === orderItem.sku
        })
        if (index === -1) throw new AppException(Errors.ORDER_ITEMS_INVALID)

        const { product, quantity } = cartItems[index]
        const variant = product?.variants?.find((variant) => variant.sku === orderItem.sku)
        if (!variant) throw new AppException(Errors.ORDER_ITEMS_INVALID)

        // 3. Check remain quantity in inventory
        const { quantity: remainQuantity, price } = variant
        if (quantity > remainQuantity) throw new AppException(Errors.ORDER_ITEMS_INVALID)
        totalAmount += price * quantity

        return {
          ...orderItem,
          quantity,
          product: product.toJSON()
        }
      })

      // 4. Process transaction
      let createMomoPaymentResponse: CreateMomoPaymentResponse
      const orderId = `FUR${new Date().getTime()}${Math.floor(Math.random() * 100)}`
      switch (createOrderDto.paymentMethod) {
        case PaymentMethod.ZALO_PAY:
        // implement later
        case PaymentMethod.MOMO:
        default:
          this.paymentService.setStrategy(this.paymentService.momoPaymentStrategy)
          const createMomoPaymentDto: CreateMomoPaymentDto = {
            partnerName: 'FURNIQUE',
            orderInfo: `Furnique - Thanh toán đơn hàng #${orderId}`,
            redirectUrl: `${this.configService.get('WEB_URL')}/customer/orders`,
            ipnUrl: `${this.configService.get('SERVER_URL')}/payment/webhook`,
            requestType: 'payWithMethod',
            amount: totalAmount,
            orderId,
            requestId: orderId,
            extraData: '',
            autoCapture: true,
            lang: 'vi',
            orderExpireTime: 15
          }
          createMomoPaymentResponse = this.paymentService.createTransaction(createMomoPaymentDto)
          break
      }

      // 5. Create payment
      const payment = await this.paymentRepository.create(
        {
          transactionStatus: TransactionStatus.DRAFT,
          transaction: createMomoPaymentResponse,
          paymentMethod: createOrderDto.paymentMethod,
          amount: totalAmount
        },
        {
          session
        }
      )

      // 6. Create order
      await this.orderRepository.create(
        {
          ...createOrderDto,
          orderId,
          items: orderItems,
          totalAmount,
          payment
        },
        {
          session
        }
      )
      await session.commitTransaction()
      return createMomoPaymentResponse
    } catch (error) {
      await session.abortTransaction()
      console.error(error)
      throw error
    }
  }

  public async confirmOrder(orderId: string, userId: string, role: UserRole) {
    // 1. Update order status and order history
    const orderHistory = new OrderHistoryDto(OrderStatus.CONFIRMED, TransactionStatus.CAPTURED, userId, role)
    const order = await this.orderRepository.findOneAndUpdate(
      {
        _id: orderId,
        orderStatus: OrderStatus.PENDING,
        transactionStatus: TransactionStatus.CAPTURED
      },
      {
        $set: { orderStatus: OrderStatus.CONFIRMED },
        $push: { orderHistory }
      }
    )
    if (!order) throw new AppException(Errors.ORDER_STATUS_INVALID)

    // 2. Send email/notification to customer
    return new SuccessResponse(true)
  }

  public async assignDeliveryToOrder(orderId: string, session?: ClientSession) {
    // 1. Update isDeliveryAssigned
    const order = await this.orderRepository.findOneAndUpdate(
      {
        _id: orderId,
        orderStatus: OrderStatus.CONFIRMED,
        transactionStatus: TransactionStatus.CAPTURED
      },
      {
        $set: { isDeliveryAssigned: true }
      },
      {
        session
      }
    )
    if (!order) throw new AppException(Errors.ORDER_STATUS_INVALID)

    return order
  }

  public async deliveryOrder(orderId: string, userId: string, role: UserRole, session?: ClientSession) {
    // 1. Update order status and order history
    const orderHistory = new OrderHistoryDto(OrderStatus.DELIVERING, TransactionStatus.CAPTURED, userId, role)
    const order = await this.orderRepository.findOneAndUpdate(
      {
        _id: orderId,
        orderStatus: OrderStatus.CONFIRMED,
        transactionStatus: TransactionStatus.CAPTURED
      },
      {
        $set: { orderStatus: OrderStatus.DELIVERING, deliveryDate: new Date() },
        $push: { orderHistory }
      },
      {
        session
      }
    )
    if (!order) throw new AppException(Errors.ORDER_STATUS_INVALID)

    return order
  }

  public async cancelOrder(cancelOrderDto: CancelOrderDto) {
    // Execute in transaction
    const session = await this.connection.startSession()
    session.startTransaction()
    try {
      const { orderId, orderHistoryItem, reason } = cancelOrderDto
      // 1. Update order status, reason and order history
      const order = await this.orderRepository.findOneAndUpdate(
        {
          _id: orderId,
          orderStatus: OrderStatus.PENDING,
          transactionStatus: TransactionStatus.CAPTURED
        },
        {
          $set: { orderStatus: OrderStatus.CANCELED, transactionStatus: TransactionStatus.CANCELED, reason },
          $push: { orderHistory: orderHistoryItem }
        },
        {
          projection: '+items',
          session
        }
      )
      if (!order) throw new AppException(Errors.ORDER_STATUS_INVALID)

      // 2. Push update quantity in product.variants to operation to execute later
      // array to process bulk update
      const operations = []
      const { items } = order
      items.forEach((item) => {
        operations.push({
          updateOne: {
            filter: { 'variants.sku': item.sku },
            update: { $inc: { 'variants.$.quantity': item.quantity } },
            session
          }
        })
      })
      await this.productRepository.model.bulkWrite(operations)

      // 3. Send email/notification to customer

      // 4. Refund payment

      await session.commitTransaction()
      return new SuccessResponse(true)
    } catch (error) {
      await session.abortTransaction()
      console.error(error)
      throw error
    }
  }

  public async completeOrder(orderId: string, userId: string, role: UserRole, session?: ClientSession) {
    // 1. Update order status and order history
    const orderHistory = new OrderHistoryDto(OrderStatus.COMPLETED, TransactionStatus.CAPTURED, userId, role)
    const order = await this.orderRepository.findOneAndUpdate(
      {
        _id: orderId,
        orderStatus: OrderStatus.DELIVERING,
        transactionStatus: TransactionStatus.CAPTURED
      },
      {
        $set: { orderStatus: OrderStatus.COMPLETED, completeDate: new Date() },
        $push: { orderHistory }
      },
      {
        session
      }
    )
    if (!order) throw new AppException(Errors.ORDER_STATUS_INVALID)

    return order
  }
}
