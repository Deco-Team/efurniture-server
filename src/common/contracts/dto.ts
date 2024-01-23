import { ApiProperty } from '@nestjs/swagger'

export class BooleanResponseDto {
  @ApiProperty()
  success: boolean
}

export class ResponseSuccessDto {
  @ApiProperty({ default: BooleanResponseDto })
  data: BooleanResponseDto
}

export class ErrorResponse {
  @ApiProperty()
  error: string

  @ApiProperty()
  message: string

  @ApiProperty()
  data: any
}
