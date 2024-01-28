import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Status } from '@src/common/contracts/constant'
import { Transform } from 'class-transformer'
import { IsNotEmpty, Min } from 'class-validator'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'

export type ProductDocument = HydratedDocument<Product>

export class Variant {
  @ApiProperty({
    example: 'EF20241010'
  })
  @IsNotEmpty()
  sku: string

  @ApiProperty({
    example: 90
  })
  @IsNotEmpty()
  @Min(1)
  price: number

  @ApiProperty({
    example: 10
  })
  @IsNotEmpty()
  @Min(1)
  quantity: number

  @ApiProperty({
    example: { color: 'yellow', material: 'cotton' }
  })
  @IsNotEmpty()
  keyValue: Map<string, string>
}

export class Dimension {
  @ApiProperty({
    example: 36
  })
  @IsNotEmpty()
  @Min(1)
  height: number

  @ApiProperty({
    example: 72
  })
  @IsNotEmpty()
  @Min(1)
  width: number

  @ApiProperty({
    example: 38
  })
  @IsNotEmpty()
  @Min(1)
  length: number
}

@Schema({
  collection: 'products',
  timestamps: {
    createdAt: true,
    updatedAt: true
  },
  toJSON: {
    transform(doc, ret) {
      delete ret.__v
    }
  }
})
export class Product {
  constructor(id?: string) {
    this._id = id
  }

  @ApiProperty()
  @Transform(({ value }) => value?.toString())
  _id: string

  @ApiProperty()
  @Prop({ type: String })
  name: string

  @ApiProperty()
  @Prop({ type: String })
  description: string

  @ApiProperty()
  @Prop({
    type: Array<String>
  })
  images: string[]

  @ApiProperty()
  @Prop({ type: Number, default: 0 })
  rate: number

  @ApiProperty()
  @Prop({ type: String })
  sku: string

  @ApiProperty()
  @Prop({ type: String })
  brand: string

  @ApiProperty()
  @Prop({ type: Dimension })
  dimensions: Dimension

  @ApiProperty()
  @Prop({ type: Number })
  price: number

  @ApiProperty()
  @Prop({ type: Number })
  quantity: number

  @ApiProperty({ type: Variant, isArray: true })
  @Prop({
    type: [Variant]
  })
  variants: Variant[]

  @ApiProperty({ type: Types.ObjectId, isArray: true })
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Category' }]
  })
  @IsNotEmpty()
  categories: Types.ObjectId[]

  @Prop({
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status
}

export const ProductSchema = SchemaFactory.createForClass(Product)

ProductSchema.plugin(paginate)
