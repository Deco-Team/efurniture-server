import { Module } from '@nestjs/common'
import { ProductModule } from '@product/product.module'
import { CustomerModule } from '@customer/customer.module'
import { DashboardService } from '@dashboard/services/dashboard.service'
import { DashboardController } from '@dashboard/controllers/dashboard.controller'
import { OrderModule } from '@order/order.module'

@Module({
  imports: [OrderModule, ProductModule, CustomerModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule {}
