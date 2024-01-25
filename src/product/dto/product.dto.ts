import { ApiProperty } from '@nestjs/swagger'
import { Dimension, Variant } from '@product/schemas/product.schema'
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator'

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @MaxLength(512)
  @IsNotEmpty()
  description: string

  @IsArray()
  @IsUrl({}, { each: true })
  @IsNotEmpty()
  images: string[]

  @ApiProperty()
  @IsNumber()
  @Max(5)
  @Min(0)
  @IsNotEmpty()
  rate: number

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(30)
  sku: string

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(30)
  brand: string

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  dimensions: Dimension

  @ApiProperty()
  @Min(1)
  @IsNotEmpty()
  price: number

  @ApiProperty()
  @Min(0)
  @IsNotEmpty()
  quantity: number

  @ApiProperty({ type: [Variant], isArray: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  variants: Variant[]
}
