import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, IDDataResponse } from '@common/contracts/dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { OrderStatus, TransactionStatus, UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { CreateOrderDto } from '@order/dto/order.dto'
import { OrderService } from '@order/services/order.service'
import { OrderHistoryDto } from '@order/schemas/order.schema'

@ApiTags('Order - Customer')
@ApiBearerAuth()
@Roles(UserRole.CUSTOMER)
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('customer')
export class OrderCustomerController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new order'
  })
  @ApiOkResponse({ type: IDDataResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const { _id, role } = _.get(req, 'user')
    createOrderDto.customer._id = _id
    createOrderDto.orderHistory = [new OrderHistoryDto(OrderStatus.PENDING, TransactionStatus.DRAFT, _id, role)]
    const result = await this.orderService.createOrder(createOrderDto)
    return result
  }
}
