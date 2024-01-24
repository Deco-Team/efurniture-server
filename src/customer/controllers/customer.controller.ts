import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { CustomerService } from '@customer/services/customer.service'
import { CreateCustomerDto } from '@customer/dto/customer.dto'
import { Customer } from '@customer/schemas/customer.schema'
import { ErrorResponse } from '@common/contracts/dto'

@ApiTags('Customer')
@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // @Post('register')
  // @ApiOkResponse({ type: Customer })
  // async login(@Body() createCustomerDto: CreateCustomerDto) {
  //   const customer = await this.customerService.createCustomer(createCustomerDto)
  //   return customer
  // }

  // @Get(':id')
  // @ApiBadRequestResponse({ type: ErrorResponse })
  // @ApiOkResponse({ type: Customer })
  // @ApiBearerAuth()
  // @UseGuards(SidesGuard)
  // @UseGuards(AccessTokenGuard)
  // @Sides(SidesAuth.CUSTOMER)
  // async getDetail(@Req() req, @Param('id') id: string) {
  //   return await this.customerService.getCustomerDetail(id)
  // }
}
