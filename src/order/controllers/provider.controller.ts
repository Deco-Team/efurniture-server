import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { PaginationQuery } from '@common/contracts/dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { OrderService } from '@order/services/order.service'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { OrderPaginateResponseDto } from '@order/dto/order.dto'

@ApiTags('Order - Provider')
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.STAFF)
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('provider')
export class OrderProviderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOkResponse({ type: OrderPaginateResponseDto })
  @ApiQuery({ type: PaginationQuery })
  async getListOrder(@Pagination() paginationParams: PaginationParams) {
    return await this.orderService.getOrderList({}, paginationParams)
  }
}
