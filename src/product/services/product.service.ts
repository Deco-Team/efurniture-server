import { Injectable } from '@nestjs/common'
import { ProductRepository } from '@product/repositories/product.repository'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { CreateProductDto } from '@product/dto/product.dto'
import { Status } from '@common/contracts/constant'
import { CategoryRepository } from '@category/repositories/category.repository'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  public async getAllProducts(paginationParams: PaginationParams) {
    return await this.productRepository.paginate(
      {
        status: {
          $ne: Status.DELETED
        }
      },
      { ...paginationParams, populate: 'categories' }
    )
  }

  public async createProduct(productDto: CreateProductDto) {
    const categories = await this.categoryRepository.findMany({ conditions: { _id: { $in: productDto.categories } } })

    if (categories.length !== productDto.categories.length) throw new AppException(Errors.OBJECT_NOT_FOUND)

    return await this.productRepository.create(productDto)
  }
}
