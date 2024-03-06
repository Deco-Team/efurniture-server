import {  Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { OrderStatus, ProductStatus, Status, UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { DashboardService } from '@dashboard/services/dashboard.service'
import { AnalyticResponseDto } from '@dashboard/dto/dashboard.dto'

@ApiTags('Dashboard - Provider')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.STAFF)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('orders')
  @ApiOperation({
    summary: 'View order count'
  })
  @ApiOkResponse({ type: AnalyticResponseDto })
  getOrderCount() {
    return this.dashboardService.getOrderCount({
      orderStatus: {
        $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING, OrderStatus.COMPLETED]
      },
      // transactionStatus: {
      //   $in: [TransactionStatus.DRAFT, TransactionStatus.CAPTURED, TransactionStatus.ERROR]
      // }
    })
  }

  @Get('sales')
  @ApiOperation({
    summary: 'View sales sum'
  })
  @ApiOkResponse({ type: AnalyticResponseDto })
  getSalesSum() {
    //   return this.dashboardService.getSalesSum({
    //  })
  }

  @Get('products')
  @ApiOperation({
    summary: 'View product count'
  })
  @ApiOkResponse({ type: AnalyticResponseDto })
  getProductCount() {
    return this.dashboardService.getProductCount({
      status: { $ne: ProductStatus.DELETED }
    })
  }

  @Get('customers')
  @ApiOperation({
    summary: 'View customer count'
  })
  @ApiOkResponse({ type: AnalyticResponseDto })
  getCustomerCount() {
    return this.dashboardService.getCustomerCount({
      status: { $ne: Status.DELETED }
    })
  }
}
