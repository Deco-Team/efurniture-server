import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Product, ProductSchema } from '@product/schemas/product.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProductModule {}
