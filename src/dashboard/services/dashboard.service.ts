import { Injectable } from '@nestjs/common'
import { OrderRepository } from '@order/repositories/order.repository'
import { OrderStatus } from '@common/contracts/constant'
import { FilterQuery } from 'mongoose'
import { Order } from '@order/schemas/order.schema'
import { AppException } from '@src/common/exceptions/app.exception'
import { Errors } from '@src/common/contracts/error'
import { ProductRepository } from '@product/repositories/product.repository'
import { CustomerRepository } from '@customer/repositories/customer.repository'
import { Product } from '@product/schemas/product.schema'
import { Customer } from '@customer/schemas/customer.schema'
import { PaymentRepository } from '@payment/repositories/payment.repository'
import { Payment } from '@payment/schemas/payment.schema'

@Injectable()
export class DashboardService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly paymentRepository: PaymentRepository
  ) {}

  public async getOrderCount(filter: FilterQuery<Order>) {
    const count = await this.orderRepository.model.countDocuments(filter)
    return count
  }

  public async getSalesSum(filter: FilterQuery<Payment>) {
    const sum = await this.paymentRepository.model.aggregate([
      { $match: filter },
      {
        $group: { _id: null, amount: { $sum: '$amount' } }
      }
    ])
    return sum
  }

  public async getProductCount(filter: FilterQuery<Product>) {
    const count = await this.productRepository.model.countDocuments(filter)
    return count
  }

  public async getCustomerCount(filter: FilterQuery<Customer>) {
    const count = await this.customerRepository.model.countDocuments(filter)
    return count
  }
}
