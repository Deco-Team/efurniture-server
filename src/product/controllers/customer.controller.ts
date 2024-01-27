import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ProductService } from '@product/services/product.service'
import { PaginationQuery } from '@src/common/contracts/dto'
import { DataResponse, PaginateResponse } from '@src/common/contracts/openapi-builder'
import { Pagination, PaginationParams } from '@src/common/decorators/pagination.decorator'
import { ProductDetailDto, ProductPublicListDto } from '@product/dto/product.dto'

@ApiTags('Product - Public')
@Controller('public')
export class PublicProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOkResponse({ type: PaginateResponse(ProductPublicListDto) })
  @ApiQuery({ type: PaginationQuery })
  async getAllProducts(@Pagination() paginationParams: PaginationParams) {
    return this.productService.getAllPublicProducts(paginationParams)
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: DataResponse(ProductDetailDto) })
  async getProductsDetail(@Param() params: any) {
    return this.productService.getProductsDetail(params.id)
  }
}
