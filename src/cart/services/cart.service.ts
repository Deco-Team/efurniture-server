import { Injectable } from '@nestjs/common'
import { Errors } from '@src/common/contracts/error'
import { CartRepository } from '@cart/repositories/cart.repository'
import { AddToCartDto } from '@cart/dto/cart.dto'
import { SuccessResponse } from '@src/common/contracts/dto'
import { ProductRepository } from '@src/product/repositories/product.repository'
import { AppException } from '@src/common/exceptions/app.exception'
import { Types } from 'mongoose'

@Injectable()
export class CartService {
  constructor(readonly cartRepository: CartRepository, private readonly productRepository: ProductRepository) {}

  public async addToCart(addToCartDto: AddToCartDto) {
    const { customerId, productId, sku, quantity } = addToCartDto

    // 1.Check exists productId, implement after product module done
    const product = await this.productRepository.findOne({
      conditions: {
        _id: productId
      }
    })
    const variant = product?.variants?.find((variant) => variant.sku === sku)
    if (!variant) throw new AppException(Errors.PRODUCT_NOT_FOUND)

    // 2. Fetch cart
    const cart = await this.cartRepository.findOne({
      conditions: {
        customerId
      }
    })

    const { quantity: remainQuantity, price } = variant
    const amount = price * quantity

    if (!cart) {
      // 3.1 Cart not existed
      // Check inventory quantity <= product.quantity
      if (quantity > remainQuantity) throw new AppException(Errors.NOT_ENOUGH_QUANTITY_IN_STOCK)
      // Create new cart
      await this.cartRepository.create({
        customerId,
        items: [{ productId: product._id, sku, quantity }],
        totalAmount: amount
      })
    } else {
      const { _id, items } = cart
      // 3.2 Cart existed, update cart
      // Check existed item
      const existedItemIndex = items.findIndex((item) => {
        return item.productId == productId && item.sku === sku
      })

      if (existedItemIndex === -1) {
        // 3.2.1 Item not existed in cart
        // Check inventory quantity <= product.quantity
        if (quantity > remainQuantity) throw new AppException(Errors.NOT_ENOUGH_QUANTITY_IN_STOCK)
        // Push new item in the first element
        items.unshift({ productId: new Types.ObjectId(product._id), sku, quantity })
      } else {
        // 3.2.2 Item existed in cart
        // Check inventory quantity + previousQuantity <= product.quantity
        if (items[existedItemIndex].quantity + quantity > remainQuantity)
          throw new AppException(Errors.NOT_ENOUGH_QUANTITY_IN_STOCK)
        // Update quantity in existed item
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

  public async getCart(customerId: string) {
    const cartList = await this.cartRepository.findOne({
      conditions: { customerId },
      projection: {
        _id: 1,
        items: 1,
        totalAmount: 1
      },
      populates: [
        {
          path: 'items.product'
        }
      ]
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
