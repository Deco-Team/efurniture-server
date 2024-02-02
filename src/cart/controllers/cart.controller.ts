import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, SuccessDataResponse } from '@common/contracts/dto'
import { CartService } from '@cart/services/cart.service'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { AddToCartDto, DeleteItemInCartDto } from '@cart/dto/cart.dto'
import { DataResponse } from '@common/contracts/openapi-builder'
import { Cart } from '@cart/schemas/cart.schema'

@ApiTags('Cart')
@ApiBearerAuth()
@Roles(UserRole.CUSTOMER)
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async addToCart(@Req() req, @Body() addToCartDto: AddToCartDto) {
    addToCartDto.customerId = _.get(req, 'user._id')
    const result = await this.cartService.addToCart(addToCartDto)
    return result
  }

  @Get()
  @ApiOkResponse({ type: DataResponse(Cart) })
  async getCart(@Req() req) {
    const customerId = _.get(req, 'user._id')
    return await this.cartService.getCart(customerId)
  }

  @Delete()
  @ApiOperation({
    summary: 'Remove item in cart'
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async deleteItemInCart(@Req() req, @Body() deleteItemInCartDto: DeleteItemInCartDto) {
    deleteItemInCartDto.customerId = _.get(req, 'user._id')
    return await this.cartService.deleteItemInCart(deleteItemInCartDto)
  }
}
