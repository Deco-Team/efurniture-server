import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import { PaginateResponse } from '@common/contracts/openapi-builder'
import { PaginationQuery } from '@src/common/contracts/dto'
import { CategoryService } from '@category/services/category.service'
import { Pagination, PaginationParams } from '@src/common/decorators/pagination.decorator'
import { PublicCategory } from '@category/dto/category.dto'

@ApiTags('Category - Customer')
@Controller('customer')
export class CategoryCustomerController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOkResponse({ type: PaginateResponse(PublicCategory) })
  @ApiQuery({ type: PaginationQuery })
  async getAllCategories(@Pagination() paginationParams: PaginationParams) {
    return await this.categoryService.getAllPublicCategories(paginationParams)
  }
}
