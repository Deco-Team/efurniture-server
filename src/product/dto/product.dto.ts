import { ApiProperty } from '@nestjs/swagger'
import { Variant } from '@product/schemas/product.schema'
import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator'
import { Types } from 'mongoose'

export class ProductPublicListDto {
  @ApiProperty({
    example: 'Sofa Luxury'
  })
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNumber()
  @Max(5)
  @Min(0)
  @IsNotEmpty()
  rate: number

  @ApiProperty({ type: Variant, isArray: true })
  variants: Variant[]

  @ApiProperty({
    example: ['https://m.media-amazon.com/images/I/61KtSpR0SfL._AC_UL480_FMwebp_QL65_.jpg']
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsNotEmpty()
  images: string[]
}

export class CreateProductDto {
  @ApiProperty({
    example: 'Sofa Luxury'
  })
  @IsNotEmpty()
  @MaxLength(50)
  name: string

  @ApiProperty({
    example: 'Sofa Luxury Description'
  })
  @IsNotEmpty()
  @MaxLength(256)
  description: string

  @ApiProperty({
    example: ['https://m.media-amazon.com/images/I/61KtSpR0SfL._AC_UL480_FMwebp_QL65_.jpg']
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsNotEmpty()
  images: string[]

  @ApiProperty({
    example: 'ERYE'
  })
  @IsNotEmpty()
  brand: string

  @ApiProperty({ type: Variant, isArray: true })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Type(() => Variant)
  variants: Variant[]

  @ApiProperty({ type: Types.ObjectId, isArray: true, example: ['65b7805c041a5a29734ce110'] })
  @IsNotEmpty()
  categories: Types.ObjectId[]
}

export class ProductDetailDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty()
  images: string[]

  @ApiProperty()
  rate: number

  @ApiProperty()
  brand: string

  @ApiProperty({ type: Variant, isArray: true })
  variants: Variant[]

  @ApiProperty({ type: Types.ObjectId, isArray: true })
  @IsNotEmpty()
  categories: Types.ObjectId[]
}
