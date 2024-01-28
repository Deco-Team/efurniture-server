import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Order, OrderSchema } from '@order/schemas/order.schema'
import { OrderCustomerController } from '@order/controllers/order-customer.controller'
import { OrderService } from '@order/services/order.service'
import { OrderRepository } from '@order/repositories/order.repository'

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  controllers: [OrderCustomerController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService]
})
export class OrderModule {}
