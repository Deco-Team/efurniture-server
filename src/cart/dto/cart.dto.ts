import { Cart, ItemDto } from '@cart/schemas/cart.schema'
import { ApiProperty } from '@nestjs/swagger'

export class AddToCartDto extends ItemDto {
  customerId?: string
}

export class ResponseCartDto {
  @ApiProperty()
  data: Cart
}