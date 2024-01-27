import { ApiProperty } from '@nestjs/swagger'
import { Dimension, Variant } from '@product/schemas/product.schema'
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator'

export class ProductPublicListDto {
  @ApiProperty({
    example: 'Sofa Luxury'
  })
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: 10
  })
  @Min(1)
  @IsNotEmpty()
  price: number

  @ApiProperty()
  @IsNumber()
  @Max(5)
  @Min(0)
  @IsNotEmpty()
  rate: number

  @ApiProperty({
    example: 10
  })
  @Min(1)
  @IsNotEmpty()
  price: number

  @ApiProperty({
    example: ['https://m.media-amazon.com/images/I/61KtSpR0SfL._AC_UL480_FMwebp_QL65_.jpg']
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsNotEmpty()
  images: string[]
}

export class CreateProductDto extends ProductPublicListDto {
  @ApiProperty({
    example: 'Sofa Luxury Description'
  })
  @MaxLength(512)
  @IsNotEmpty()
  description: string

  @ApiProperty({
    example: 'EF20241212'
  })
  @IsNotEmpty()
  @MaxLength(30)
  sku: string

  @ApiProperty({
    example: 'SureFit'
  })
  @IsNotEmpty()
  @MaxLength(30)
  brand: string

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  dimensions: Dimension

  @ApiProperty({
    example: 100
  })
  @Min(0)
  @IsNotEmpty()
  quantity: number

  @ApiProperty({
    type: Variant,
    isArray: true
  })
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  variants: Variant[]

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsNotEmpty()
  categories: string[]
}

export class ProductDetailDto extends CreateProductDto {
  @ApiProperty()
  _id: string
}
