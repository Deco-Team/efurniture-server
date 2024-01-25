import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ProductService } from '@product/services/product.service'
import { Product } from '@product/schemas/product.schema'
import { Pagination, PaginationParams } from '@src/common/decorators/pagination.decorator'
import { PaginationQuery } from '@src/common/contracts/dto'
import { CreateProductDto } from '@product/dto/product.dto'
import { Roles } from '@src/auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard'
import { RolesGuard } from '@src/auth/guards/roles.guard'
import { UserRole } from '@src/common/contracts/constant'

@ApiTags('Product')
// @ApiBearerAuth()
// @Roles(UserRole.ADMIN, UserRole.STAFF)
// @UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOkResponse({ type: Product })
  @ApiQuery({ type: PaginationQuery })
  async getAllProducts(@Pagination() paginationParams: PaginationParams) {
    return this.productService.getAllProducts(paginationParams)
  }

  @Post()
  @ApiCreatedResponse({ type: Product })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto)
  }
}
