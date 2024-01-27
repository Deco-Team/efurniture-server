import { HttpStatus } from '@nestjs/common'
import { ErrorResponse } from '@common/exceptions/app.exception'
export const Errors: Record<string, ErrorResponse> = {
  OBJECT_NOT_FOUND: {
    error: 'OBJECT_NOT_FOUND',
    message: 'Không tìm thấy đối tượng',
    httpStatus: HttpStatus.NOT_FOUND
  },
  WRONG_EMAIL_OR_PASSWORD: {
    error: 'WRONG_EMAIL_OR_PASSWORD',
    message: 'Email hoặc mật khẩu không đúng',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  EMAIL_ALREADY_EXIST: {
    error: 'EMAIL_ALREADY_EXIST',
    message: 'Email đã được sử dụng',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  NOT_ENOUGH_QUANTITY_IN_STOCK: {
    error: 'NOT_ENOUGH_QUANTITY_IN_STOCK',
    message: 'Không đủ số lượng trong kho.',
    httpStatus: HttpStatus.BAD_REQUEST
  }
}
