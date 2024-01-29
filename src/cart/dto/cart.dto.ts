import { Cart, ItemDto } from '@cart/schemas/cart.schema'
import { DataResponse } from '@src/common/contracts/openapi-builder'

export class AddToCartDto extends ItemDto {
  customerId?: string
}

export class CartResponseDto extends DataResponse(Cart) {}