import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator'

export class PublicCategory {
  @ApiProperty()
  _id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty()
  image: string
}

export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(30)
    name: string
    
    @ApiProperty()
    @MaxLength(100)
    description: string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsUrl()
    image: string
}
