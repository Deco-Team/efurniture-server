import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '@category/repositories/category.repository'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { Status } from '@common/contracts/constant'

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAllCategories(paginationParams: PaginationParams) {
    return await this.categoryRepository.paginate(
      {
        status: {
          $ne: Status.DELETED
        }
      },
      paginationParams
    )
  }
}
