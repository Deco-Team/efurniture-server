import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Order, OrderSchema } from '@order/schemas/order.schema'
import { OrderCustomerController } from '@src/order/controllers/customer.controller'
import { OrderService } from '@order/services/order.service'
import { OrderRepository } from '@order/repositories/order.repository'
import { CartModule } from '@cart/cart.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), CartModule],
  controllers: [OrderCustomerController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService]
})
export class OrderModule {}
