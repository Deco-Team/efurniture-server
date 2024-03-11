import { ApiProperty } from '@nestjs/swagger'
import { TransactionStatus } from '@common/contracts/constant'
import { PaymentMethod } from '@payment/contracts/constant'
import { MomoPaymentResponseDto } from '@payment/dto/momo-payment.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'

export class PaymentDto {
  @ApiProperty()
  _id: string

  @ApiProperty({ enum: TransactionStatus })
  transactionStatus: TransactionStatus

  @ApiProperty()
  transaction: MomoPaymentResponseDto

  @ApiProperty({ isArray: true, type: MomoPaymentResponseDto })
  transactionHistory: MomoPaymentResponseDto[]

  @ApiProperty()
  paymentMethod: PaymentMethod

  @ApiProperty()
  amount: number
}

export class PaymentPaginateResponseDto extends DataResponse(
  class PaymentPaginateResponse extends PaginateResponse(PaymentDto) {}
) {}