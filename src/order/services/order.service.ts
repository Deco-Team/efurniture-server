import { Injectable } from '@nestjs/common'
import { OrderRepository } from '@order/repositories/order.repository'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { OrderStatus } from '@common/contracts/constant'
import { CreateOrderDto } from '@order/dto/order.dto'
import { FilterQuery } from 'mongoose'
import { Order } from '@order/schemas/order.schema'
import { IDResponse } from '@src/common/contracts/dto'

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async getCustomerOrderList(filter: FilterQuery<Order>, paginationParams: PaginationParams) {
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
    // Check valid product in items

    // Execute in transaction
    // 1. Fetch product in items and check valid
    // 2. Subtract items in cart
    // 3. Create order
    // 4. Process payment
    // 5. Send email/notification to customer
    // 6. Send notification to customer

    const order = await this.orderRepository.create(createOrderDto)
    return new IDResponse(order._id)
  }
}
