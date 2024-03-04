import { Injectable, Logger } from '@nestjs/common'
import { IPaymentStrategy } from '@payment/strategies/payment-strategy.interface'

@Injectable()
export class ZaloPayPaymentStrategy implements IPaymentStrategy {
  private readonly logger = new Logger(ZaloPayPaymentStrategy.name)
  constructor() {}
  createTransaction(data: any): void {}
  getTransaction(queryDto: any): any {}
  refundTransaction(refundDto: any): any {}
  getRefundTransaction(queryRefundDto: any): any {}
}
