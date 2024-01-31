import { Injectable } from '@nestjs/common'
import { OrderRepository } from '@order/repositories/order.repository'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { OrderStatus } from '@common/contracts/constant'
import { CreateOrderDto } from '@order/dto/order.dto'
import { Connection, FilterQuery } from 'mongoose'
import { Order } from '@order/schemas/order.schema'
import { IDResponse } from '@common/contracts/dto'
import { AppException } from '@src/common/exceptions/app.exception'
import { Errors } from '@src/common/contracts/error'
import { CartService } from '@cart/services/cart.service'
import { InjectConnection } from '@nestjs/mongoose'

@Injectable()
export class OrderService {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService
  ) {}

  public async getOrderList(filter: FilterQuery<Order>, paginationParams: PaginationParams) {
    const result = await this.orderRepository.paginate(
      {
        ...filter,
        status: {
          $ne: OrderStatus.DELETED
        }
      },
      { ...paginationParams }
    )
    return result
  }

  public async createOrder(createOrderDto: CreateOrderDto) {
    // Execute in transaction
    const session = await this.connection.startSession()
    session.startTransaction()
    try {
      // 1. Fetch product in cart items
      const {
        _id: cartId,
        items,
        totalAmount: cartTotalAmount
      } = await this.cartService.getListCard(createOrderDto.customer?._id)
      if (items.length === 0) throw new AppException(Errors.CART_EMPTY)
      let cartItems = items

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

        // 3. check remain quantity in inventory
        const { quantity: remainQuantity, price } = variant
        if (quantity > remainQuantity) throw new AppException(Errors.ORDER_ITEMS_INVALID)
        totalAmount += price * quantity

        // 4. Subtract items in cart
        cartItems.splice(index, 1)

        return {
          ...orderItem,
          quantity,
          product: product.toJSON()
        }
      })

      // 5. Update new cart
      await this.cartService.cartRepository.findOneAndUpdate(
        {
          _id: cartId
        },
        {
          items: cartItems,
          totalAmount: cartTotalAmount - totalAmount
        },
        // {
        //   session
        // }
      )

      // 6. Create order
      const order = await this.orderRepository.create(
        {
          ...createOrderDto,
          items: orderItems,
          totalAmount
        },
        // {
        //   session
        // }
      )

      // 7. Process payment
      // 8. Send email/notification to customer
      // 9. Send notification to staff

      await session.commitTransaction()
      return new IDResponse(order._id)
    } catch (error) {
      await session.abortTransaction()
      console.error(error)
      throw error
    }
  }
}
