import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, PaginationQuery, SuccessDataResponse } from '@common/contracts/dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { OrderStatus, TransactionStatus, UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { OrderService } from '@order/services/order.service'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { CancelOrderDto, OrderPaginateResponseDto, OrderResponseDto } from '@order/dto/order.dto'
import { OrderHistoryDto } from '@order/schemas/order.schema'

@ApiTags('Order - Provider')
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.STAFF)
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('provider')
export class OrderProviderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({
    summary: 'Paginate list order'
  })
  @ApiOkResponse({ type: OrderPaginateResponseDto })
  @ApiQuery({ type: PaginationQuery })
  async getListOrder(@Pagination() paginationParams: PaginationParams) {
    return await this.orderService.getOrderList({}, paginationParams)
  }

  @Get(':orderId')
  @ApiOperation({
    summary: 'View order detail'
  })
  @ApiOkResponse({ type: OrderResponseDto })
  getOrderDetail(@Param('orderId') orderId: string) {
    return this.orderService.getOrderDetail(orderId)
  }

  @Patch(':orderId/confirm')
  @ApiOperation({
    summary: 'Confirm order'
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async confirmOrder(@Req() req, @Param('orderId') orderId: string) {
    const { _id: userId, role } = _.get(req, 'user')
    const result = await this.orderService.confirmOrder(orderId, userId, role)
    return result
  }

  @Patch(':orderId/cancel')
  @ApiOperation({
    summary: 'Cancel order (new field: cancel reason)'
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async cancelOrder(@Req() req, @Param('orderId') orderId: string, @Body() cancelOrderDto: CancelOrderDto) {
    const { _id: userId, role } = _.get(req, 'user')
    cancelOrderDto.orderId = orderId
    cancelOrderDto.orderHistoryItem = new OrderHistoryDto(
      OrderStatus.CANCELED,
      TransactionStatus.CANCELED,
      userId,
      role
    )
    const result = await this.orderService.cancelOrder(cancelOrderDto)
    return result
  }
}
