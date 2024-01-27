import { Injectable, NotFoundException } from '@nestjs/common'
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

  public async getAllPublicProducts(paginationParams: PaginationParams) {
    const result = await this.productRepository.paginate(
      {
        status: {
          $in: Status.ACTIVE
        }
      },
      {
        ...paginationParams,
        projection: {
          name: 1,
          price: 1,
          rate: 1,
          images: 1
        }
      }
    )
    return result
  }

  public async createProduct(productDto: CreateProductDto) {
    const categories = await this.categoryRepository.findMany({ conditions: { _id: { $in: productDto.categories } } })

    if (categories.length !== productDto.categories.length) throw new AppException(Errors.OBJECT_NOT_FOUND)

    return await this.productRepository.create(productDto)
  }

  public async getProductsDetail(id: string) {
    try {
      const result = await this.productRepository.findOne({
        conditions: {
          _id: id
        },
        projection: {
          status: 0,
          createdAt: 0,
          updatedAt: 0
        }
      })
      if (!result) throw new NotFoundException(`Product not found with id: ${id}`)
      return result
    } catch (error) {
      throw new NotFoundException(`Product not found with id: ${id}`)
    }
  }
}
