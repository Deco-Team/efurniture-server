import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { Payment } from '@payment/schemas/payment.schema'

// export class PaymentResponseDto extends DataResponse(Payment) {}

export class CreateZaloPayPaymentDto {
  @ApiProperty()
  app_id: string

  @ApiProperty()
  app_trans_id: string

  @ApiProperty()
  app_user: string

  @ApiProperty()
  app_time: string

  @ApiProperty()
  item: string

  @ApiProperty()
  embed_data: string

  @ApiProperty()
  amount: number

  @ApiProperty()
  description: string

  @ApiProperty()
  bank_code: string

  @ApiProperty()
  callback_url: string

  @ApiProperty()
  mac: string
}
