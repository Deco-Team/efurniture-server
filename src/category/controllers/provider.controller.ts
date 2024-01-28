import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { UserRole } from '@common/contracts/constant'
import { Roles } from '@src/auth/decorators/roles.decorator'
import { Category } from '@category/schemas/category.schema'
import { PaginateResponse } from '@common/contracts/openapi-builder'
import { PaginationQuery } from '@src/common/contracts/dto'
import { CategoryService } from '@category/services/category.service'
import { Pagination, PaginationParams } from '@src/common/decorators/pagination.decorator'
import { CreateCategoryDto } from '@category/dto/category.dto'

@ApiTags('Category - Provider')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.STAFF)
@Controller('provider')
export class CategoryProviderController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOkResponse({ type: PaginateResponse(Category) })
  @ApiQuery({ type: PaginationQuery })
  async getAllCategories(@Pagination() paginationParams: PaginationParams) {
    return await this.categoryService.getAllCategories(paginationParams)
  }

  @Post()
  @ApiCreatedResponse({ type: Category })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto)
  }
}
