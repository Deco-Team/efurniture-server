import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ProductRepository } from '@product/repositories/product.repository'
import { PaginationParams } from '@src/common/decorators/pagination.decorator'
import { CreateProductDto } from '@product/dto/product.dto'

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  public async getAllProducts(paginationParams: PaginationParams) {
    return await this.productRepository.paginate({}, paginationParams)
  }

  public async createProduct(productDto: CreateProductDto) {
    return await this.productRepository.create(productDto)
  }
}
