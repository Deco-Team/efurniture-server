import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, ResponseSuccessDto } from '@common/contracts/dto'
import { CartService } from '@cart/services/cart.service'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { AddToCartDto, ResponseCartDto } from '@cart/dto/cart.dto'

@ApiTags('Cart')
@ApiBearerAuth()
@Roles(UserRole.CUSTOMER)
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOkResponse({ type: ResponseSuccessDto })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async addToCart(@Req() req, @Body() addToCartDto: AddToCartDto) {
    addToCartDto.customerId = _.get(req, 'user._id')
    const customer = await this.cartService.addToCart(addToCartDto)
    return customer
  }

  @Get()
  @ApiOkResponse({ type: ResponseCartDto })
  async getListCard(@Req() req) {
    const customerId = _.get(req, 'user._id')
    return await this.cartService.getListCard(customerId)
  }
}
