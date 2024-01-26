import { BadRequestException, Injectable } from '@nestjs/common'
import { Errors } from '@src/common/contracts/error'
import { CartRepository } from '@cart/repositories/cart.repository'
import { AddToCartDto } from '@cart/dto/cart.dto'
import { SuccessResponse } from '@src/common/contracts/dto'

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  public async addToCart(addToCartDto: AddToCartDto) {
    const { customerId, product, quantity } = addToCartDto

    // TODO: Check exists productId, implement after product module done

    // TODO: Check inventory quantity <= product.quantity

    const cart = await this.cartRepository.findOne({
      conditions: {
        customerId
      }
    })
    const amount = product.price * quantity
    if (!cart) {
      // create new cart
      await this.cartRepository.create({
        customerId,
        items: [{ product, quantity }],
        totalAmount: amount
      })
    } else {
      const { _id, items } = cart
      // update cart
      // check existed item
      const existedItemIndex = items.findIndex((item) => item.product._id === product._id)

      if (existedItemIndex === -1) {
        // push new item in the first element
        items.unshift({ product, quantity })
      } else {
        // update quantity in existed item
        items[existedItemIndex].quantity += quantity
      }
      const totalAmount = (cart.totalAmount += amount)
      await this.cartRepository.findOneAndUpdate(
        {
          _id
        },
        {
          items,
          totalAmount
        }
      )
    }
    return new SuccessResponse(true)
  }

  public async getListCard(customerId: string) {
    const cartList = await this.cartRepository.findOne({
      conditions: { customerId },
      projection: {
        _id: 1,
        items: 1,
        totalAmount: 1
      }
    })
    if (!cartList) {
      const newCartList = await this.cartRepository.create({
        customerId,
        items: [],
        totalAmount: 0
      })
      return { _id: newCartList._id, items: [], totalAmount: 0 }
    }
    return cartList
  }
}
