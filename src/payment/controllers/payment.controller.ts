import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'
import { PaymentService } from '@payment/services/payment.service'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { PaginationQuery } from '@common/contracts/dto'
import { RolesGuard } from '@auth/guards/roles.guard'
import { PaymentPaginateResponseDto } from '@payment/dto/payment.dto'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'

@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard.ACCESS_TOKEN)
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @ApiOperation({
    summary: 'Get transaction list of payment'
  })
  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOkResponse({ type: PaymentPaginateResponseDto })
  @ApiQuery({ type: PaginationQuery })
  paginate(@Pagination() paginationParams: PaginationParams) {
    return this.paymentService.getPaymentList({}, paginationParams)
  }

  @ApiOperation({
    summary: 'Webhook Handler for Instant Payment Notification (MOMO)'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('webhook')
  webhook(@Body() momoPaymentResponseDto) {
    // TODO: 1. Validate signature with other data => implement later
    console.log('Handling webhook', momoPaymentResponseDto)
    return this.paymentService.processWebhook(momoPaymentResponseDto)
  }

  // @ApiOperation({
  //   summary: 'Query payment order'
  // })
  // @Post('query')
  // @ApiBadRequestResponse({ type: ErrorResponse })
  // @ApiOkResponse({ type: CustomerResponseDto })
  // query(@Req() req) {
  //   this.paymentService.setStrategy(this.momoPaymentStrategy)
  //   const queryMomoPaymentDto: QueryMomoPaymentDto = {
  //     orderId: 'MOMO1709564985022',
  //     requestId: 'MOMO1709564985022',
  //     lang: 'vi'
  //   }
  //   // {
  //   //   "partnerCode": "MOMO",
  //   //   "orderId": "MOMO1709553563870",
  //   //   "requestId": "MOMO1709553563870",
  //   //   "extraData": "",
  //   //   "amount": 123456,
  //   //   "transId": 3996000196,
  //   //   "payType": "credit",
  //   //   "resultCode": 0,
  //   //   "refundTrans": [
  //   //     {
  //   //       "orderId": "MOMO1709556182884",
  //   //       "amount": 50000,
  //   //       "resultCode": 0,
  //   //       "transId": 3996022041,
  //   //       "createdTime": 1709556185900
  //   //     }
  //   //   ],
  //   //   "message": "Thành công.",
  //   //   "responseTime": 1709562845129,
  //   //   "lastUpdated": 1709556185892,
  //   //   "signature": null
  //   // }
  //   return this.paymentService.getTransaction(queryMomoPaymentDto)
  // }

  // @ApiOperation({
  //   summary: 'Refund payment order'
  // })
  // @Post('refund')
  // @ApiBadRequestResponse({ type: ErrorResponse })
  // @ApiOkResponse({ type: CustomerResponseDto })
  // refund(@Req() req) {
  //   this.paymentService.setStrategy(this.momoPaymentStrategy)
  //   const refundMomoPaymentDto: RefundMomoPaymentDto = {
  //     orderId: 'MOMO' + new Date().getTime(),
  //     requestId: 'MOMO' + new Date().getTime(),
  //     amount: 50000,
  //     transId: 3996000196,
  //     lang: 'vi',
  //     description: 'Hoàn tiền đơn hàng'
  //   }
  //   return this.paymentService.refundTransaction(refundMomoPaymentDto)
  //   // {
  //   //   "partnerCode": "MOMO",
  //   //   "orderId": "MOMO1709556182884",
  //   //   "requestId": "MOMO1709556182884",
  //   //   "amount": 50000,
  //   //   "transId": 3996022041,
  //   //   "resultCode": 0,
  //   //   "message": "Thành công.",
  //   //   "responseTime": 1709556185927
  //   // }
  // }
}
