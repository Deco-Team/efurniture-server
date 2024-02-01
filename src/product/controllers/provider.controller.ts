import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ProductService } from '@product/services/product.service'
import { Product } from '@product/schemas/product.schema'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { PaginationQuery } from '@common/contracts/dto'
import { CreateProductDto, ProductPaginateDto } from '@product/dto/product.dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { UserRole } from '@common/contracts/constant'
import { DataResponse } from '@common/contracts/openapi-builder';

@ApiTags('Product - Provider')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.STAFF)
@Controller('provider')
export class ProviderProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOkResponse({ type: ProductPaginateDto })
  @ApiQuery({ type: PaginationQuery })
  async getAllProducts(@Pagination() paginationParams: PaginationParams) {
    return this.productService.getAllProducts(paginationParams)
  }

  @Post()
  @ApiCreatedResponse({ type: DataResponse(Product) })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto)
  }
}
