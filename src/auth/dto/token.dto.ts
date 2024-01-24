import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class TokenResDto {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string
}

export class ResponseTokenDto {
  @ApiProperty()
  data: TokenResDto
}

export class RefreshTokenReqDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string
}
