import { Cart, ItemDto } from '@cart/schemas/cart.schema'
import { DataResponse } from '@common/contracts/openapi-builder'

export class AddToCartDto extends ItemDto {
  customerId?: string
}

export class CartResponseDto extends DataResponse(Cart) {}