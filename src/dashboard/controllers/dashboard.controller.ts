import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { OrderStatus, ProductStatus, Status, TransactionStatus, UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { DashboardService } from '@dashboard/services/dashboard.service'
import { AnalyticResponseDto } from '@dashboard/dto/dashboard.dto'
import * as moment from 'moment'

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
  async getOrderCount() {
    const startOfCurrentMonth = moment().startOf('month')
    const startOfPreviousMonth = moment().subtract(1, 'months').startOf('month')
    const count = await this.dashboardService.getOrderCount({
      orderStatus: {
        $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING, OrderStatus.COMPLETED]
      },
      transactionStatus: {
        $in: [TransactionStatus.CAPTURED, TransactionStatus.DRAFT, TransactionStatus.ERROR]
      },
      createdAt: { $lte: moment(), $gte: startOfCurrentMonth }
    })
    const previousCount = await this.dashboardService.getOrderCount({
      orderStatus: {
        $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING, OrderStatus.COMPLETED]
      },
      transactionStatus: {
        $in: [TransactionStatus.CAPTURED, TransactionStatus.DRAFT, TransactionStatus.ERROR]
      },
      createdAt: { $lt: startOfCurrentMonth, $gte: startOfPreviousMonth }
    })
    const percent = previousCount !== 0 ? Math.round(((count - previousCount) / previousCount) * 100 * 100) / 100 : 0
    return { count, previousCount, percent }
  }

  @Get('sales')
  @ApiOperation({
    summary: 'View sales sum'
  })
  @ApiOkResponse({ type: AnalyticResponseDto })
  async getSalesSum() {
    const startOfCurrentMonth = moment().startOf('month')
    const startOfPreviousMonth = moment().subtract(1, 'months').startOf('month')
    const count = await this.dashboardService.getSalesSum({
      transactionStatus: TransactionStatus.CAPTURED,
      createdAt: { $lte: moment().toDate(), $gte: startOfCurrentMonth.toDate() }
    })
    const previousCount = await this.dashboardService.getSalesSum({
      transactionStatus: TransactionStatus.CAPTURED,
      createdAt: { $lt: startOfCurrentMonth.toDate(), $gte: startOfPreviousMonth.toDate() }
    })
    const percent = previousCount !== 0 ? Math.round(((count - previousCount) / previousCount) * 100 * 100) / 100 : 0
    return { count, previousCount, percent }
  }

  @Get('products')
  @ApiOperation({
    summary: 'View product count'
  })
  @ApiOkResponse({ type: AnalyticResponseDto })
  async getProductCount() {
    const startOfCurrentMonth = moment().startOf('month')
    const startOfPreviousMonth = moment().subtract(1, 'months').startOf('month')
    const count = await this.dashboardService.getProductCount({
      status: { $ne: ProductStatus.DELETED },
      createdAt: { $lte: moment(), $gte: startOfCurrentMonth }
    })
    const previousCount = await this.dashboardService.getProductCount({
      status: { $ne: ProductStatus.DELETED },
      createdAt: { $lt: startOfCurrentMonth, $gte: startOfPreviousMonth }
    })
    const percent = previousCount !== 0 ? Math.round(((count - previousCount) / previousCount) * 100 * 100) / 100 : 0
    return { count, previousCount, percent }
  }

  @Get('customers')
  @ApiOperation({
    summary: 'View customer count'
  })
  @ApiOkResponse({ type: AnalyticResponseDto })
  async getCustomerCount() {
    const startOfCurrentMonth = moment().startOf('month')
    const startOfPreviousMonth = moment().subtract(1, 'months').startOf('month')
    const count = await this.dashboardService.getCustomerCount({
      status: { $ne: Status.DELETED },
      createdAt: { $lte: moment(), $gte: startOfCurrentMonth }
    })
    const previousCount = await this.dashboardService.getCustomerCount({
      status: { $ne: Status.DELETED },
      createdAt: { $lt: startOfCurrentMonth, $gte: startOfPreviousMonth }
    })
    const percent = previousCount !== 0 ? Math.round(((count - previousCount) / previousCount) * 100 * 100) / 100 : 0
    return { count, previousCount, percent }
  }
}
