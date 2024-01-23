import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(30)
  name: string

  @ApiProperty()
  @IsNotEmpty()
  //@IsPhoneNumber()
  phone: string
}
