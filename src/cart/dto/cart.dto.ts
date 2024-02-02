import { Cart, ItemDto } from '@cart/schemas/cart.schema'
import { DataResponse } from '@common/contracts/openapi-builder'
import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'

export class AddToCartDto extends ItemDto {
  customerId?: string
}

export class UpdateCartDto extends ItemDto {
  customerId?: string
}

export class DeleteItemInCartDto {
  @ApiProperty({ example: 'productId' })
  @IsNotEmpty()
  @IsMongoId()
  productId: Types.ObjectId

  @ApiProperty({ example: 'EF20241212' })
  sku: string

  customerId?: string
}

export class CartResponseDto extends DataResponse(Cart) {}
