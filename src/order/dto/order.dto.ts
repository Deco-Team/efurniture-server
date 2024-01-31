import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DataResponse } from '@src/common/contracts/openapi-builder'
import { ArrayMinSize, IsMongoId, IsNotEmpty, MaxLength, Min, ValidateNested } from 'class-validator'
import { CustomerOrderDto, Order } from '@order/schemas/order.schema'
import { Prop } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Type } from 'class-transformer'

export class CreateOrderItemDto {
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  @ApiProperty({ example: 'productId' })
  @IsNotEmpty()
  @IsMongoId()
  productId: Types.ObjectId

  @Prop()
  @ApiProperty({ example: 'EF20241212' })
  sku: string
}

export class CreateOrderDto {
  @ApiProperty({ type: () => CustomerOrderDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomerOrderDto)
  customer: CustomerOrderDto

  @ApiProperty({ isArray: true, type: CreateOrderItemDto })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[]

  @ApiPropertyOptional()
  @MaxLength(256)
  notes?: string
}

export class OrderResponseDto extends DataResponse(Order) {}
