import { HttpStatus } from '@nestjs/common';
export const Errors = {
  OBJECT_NOT_FOUND: {
    error: 'OBJECT_NOT_FOUND',
    message: 'Object not found',
    httpStatus: HttpStatus.NOT_FOUND,
  },
};
