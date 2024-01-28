import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, IDDataResponse, PaginationQuery } from '@common/contracts/dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { CreateOrderDto, OrderResponseDto } from '@order/dto/order.dto'
import { OrderService } from '@order/services/order.service'
import { Pagination, PaginationParams } from '@src/common/decorators/pagination.decorator'

@ApiTags('Order - Customer')
@ApiBearerAuth()
@Roles(UserRole.CUSTOMER)
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('customer')
export class OrderCustomerController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOkResponse({ type: IDDataResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    createOrderDto.customer._id = _.get(req, 'user._id')
    const result = await this.orderService.createOrder(createOrderDto)
    return result
  }

  @Get()
  @ApiOkResponse({ type: OrderResponseDto })
  @ApiQuery({ type: PaginationQuery })
  async getListOrder(@Req() req, @Pagination() paginationParams: PaginationParams) {
    const customerId = _.get(req, 'user._id')
    return await this.orderService.getCustomerOrderList({ customerId }, paginationParams)
  }
}
