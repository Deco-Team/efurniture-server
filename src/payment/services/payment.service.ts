import { Injectable } from '@nestjs/common'
import { IPaymentStrategy } from '@payment/strategies/payment-strategy.interface'
import {
  CreateMomoPaymentDto,
  MomoPaymentResponseDto,
  QueryMomoPaymentDto,
  RefundMomoPaymentDto
} from '@payment/dto/momo-payment.dto'
import { MomoPaymentStrategy } from '@payment/strategies/momo.strategy'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { OrderRepository } from '@order/repositories/order.repository'
import { CartService } from '@cart/services/cart.service'
import { ProductRepository } from '@product/repositories/product.repository'
import { PaymentRepository } from '@payment/repositories/payment.repository'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { OrderHistoryDto } from '@order/schemas/order.schema'
import { OrderStatus, TransactionStatus, UserRole } from '@common/contracts/constant'

@Injectable()
export class PaymentService {
  private strategy: IPaymentStrategy
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService,
    private readonly productRepository: ProductRepository,
    private readonly paymentRepository: PaymentRepository,
    readonly momoPaymentStrategy: MomoPaymentStrategy
  ) {}

  public setStrategy(strategy: IPaymentStrategy) {
    this.strategy = strategy
  }

  public createTransaction(createPaymentDto: CreateMomoPaymentDto) {
    return this.strategy.createTransaction(createPaymentDto)
  }

  public getTransaction(queryPaymentDto: QueryMomoPaymentDto) {
    return this.strategy.getTransaction(queryPaymentDto)
  }

  public refundTransaction(refundPaymentDto: RefundMomoPaymentDto) {
    return this.strategy.refundTransaction(refundPaymentDto)
  }

  public getRefundTransaction(queryPaymentDto: QueryMomoPaymentDto) {
    return this.strategy.getRefundTransaction(queryPaymentDto)
  }

  public async processWebhook(momoPaymentResponseDto: MomoPaymentResponseDto) {
    // Execute in transaction
    const session = await this.connection.startSession()
    session.startTransaction()
    try {
      // 1. Get order from orderId
      const order = await this.orderRepository.findOne({
        conditions: {
          orderId: momoPaymentResponseDto.orderId
        }
      })
      if (!order) throw new AppException(Errors.ORDER_NOT_FOUND)

      // 1. Fetch product in cart items
      const { _id: cartId, items, totalAmount: cartTotalAmount } = await this.cartService.getCart(order.customer._id)
      if (items.length === 0) throw new AppException(Errors.CART_EMPTY)
      let cartItems = items

      let totalAmount = 0
      let orderItems = order.items

      // array to process bulk update
      const operations = []

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
        const { sku, quantity: remainQuantity, price } = variant
        if (quantity > remainQuantity) throw new AppException(Errors.ORDER_ITEMS_INVALID)
        totalAmount += price * quantity

        // 4. Subtract items in cart
        cartItems.splice(index, 1)

        // 5. Push update quantity in product.variants to operation to execute later
        operations.push({
          updateOne: {
            filter: { 'variants.sku': sku },
            update: { $set: { 'variants.$.quantity': remainQuantity - quantity } },
            session
          }
        })

        return {
          ...orderItem,
          quantity,
          product: product.toJSON()
        }
      })

      // 5. Update new cart
      cartItems = cartItems.map((item) => {
        delete item.product // remove product populate before update
        return item
      })
      await this.cartService.cartRepository.findOneAndUpdate(
        {
          _id: cartId
        },
        {
          items: cartItems,
          totalAmount: cartTotalAmount - totalAmount
        },
        {
          session
        }
      )

      // 6. Bulk write Update quantity in product.variants
      await this.productRepository.model.bulkWrite(operations)

      // 7. Update order transactionStatus
      const orderHistory = new OrderHistoryDto(
        OrderStatus.PENDING,
        TransactionStatus.CAPTURED,
        order.customer._id,
        UserRole.CUSTOMER
      )
      await this.orderRepository.findOneAndUpdate(
        {
          _id: order._id
        },
        {
          $set: {
            transactionStatus: TransactionStatus.CAPTURED,
            'payment.transactionStatus': TransactionStatus.CAPTURED,
            'payment.transaction': momoPaymentResponseDto
          },
          $push: { orderHistory }
        },
        {
          session
        }
      )

      // 8.  Update payment transactionStatus, transaction
      await this.paymentRepository.findOneAndUpdate(
        {
          _id: order.payment._id
        },
        {
          $set: {
            transactionStatus: TransactionStatus.CAPTURED,
            transaction: momoPaymentResponseDto
          },
          $push: { transactionHistory: momoPaymentResponseDto }
        },
        {
          session
        }
      )

      // 9. Send email/notification to customer
      
      // 10. Send notification to staff
      await session.commitTransaction()
      return true
    } catch (error) {
      await session.abortTransaction()
      console.error(error)
      throw error
    }
  }
}
