import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Customer, CustomerSchema } from '@customer/schemas/customer.schema'
import { CustomerRepository } from '@customer/repositories/customer.repository'
import { CustomerService } from '@customer/services/customer.service'
import { CustomerController } from '@src/customer/controllers/customer.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
