import { HttpStatus } from '@nestjs/common'
export const Errors = {
  OBJECT_NOT_FOUND: {
    error: 'OBJECT_NOT_FOUND',
    message: 'không tìm thấy đối tượng',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  WRONG_EMAIL_OR_PASSWORD: {
    error: 'WRONG_EMAIL_OR_PASSWORD',
    message: 'Email hoặc mật khẩu không đúng',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
};
