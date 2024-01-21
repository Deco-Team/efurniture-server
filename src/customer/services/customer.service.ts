import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerRepository } from '@customer/repositories/customer.repository';
import { Customer, CustomerDocument } from '@customer/schemas/customer.schema';
import { CreateCustomerDto } from '@customer/dto/customer.dto';
import { Types } from 'mongoose';
import { Errors } from '@src/common/contracts/error';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerRepository.create(createCustomerDto);
    return customer;
  }

  public async getCustomerDetail(customerId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      conditions: { _id: customerId },
    });
    if (!customer)
      throw new BadRequestException(Errors.OBJECT_NOT_FOUND.message);
    return customer;
  }
}
