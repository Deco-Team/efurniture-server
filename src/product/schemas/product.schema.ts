import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Status } from '@src/common/contracts/constant'
import { URL_REGEX } from '@src/config'
import { Transform } from 'class-transformer'
import { IsNotEmpty, Min } from 'class-validator'
import { HydratedDocument } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'

export type ProductDocument = HydratedDocument<Product>

export class Variant {
  @ApiProperty()
  @IsNotEmpty()
  sku: string

  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  price: number

  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  quantity: number

  @ApiProperty()
  @IsNotEmpty()
  keyValue: Map<string, string>
}

export class Dimension {
  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  height: number

  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  width: number

  @ApiProperty()
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

  @Transform(({ value }) => value?.toString())
  _id: string

  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string

  @ApiProperty()
  @Prop({ type: String, maxlength: 512, required: true })
  description: string

  @ApiProperty()
  @Prop({
    type: Array<String>,
    validate: {
      validator: (v: string[]) => {
        return v.some((s) => URL_REGEX.test(s))
      },
      message: (props) => `${props.value} is not a valid image url!`
    },
    required: true
  })
  images: string[]

  @ApiProperty()
  @Prop({ type: Number, max: 5, min: 0, default: 0, required: true })
  rate: number

  @ApiProperty()
  @Prop({ type: String, maxlength: 30, required: true })
  sku: string

  @ApiProperty()
  @Prop({ type: String, maxlength: 30, required: true })
  brand: string

  @ApiProperty()
  @Prop({ type: Dimension, required: true })
  dimensions: Dimension

  @ApiProperty()
  @Prop({ type: Number, min: 1, required: true })
  price: number

  @ApiProperty()
  @Prop({ type: Number, min: 0, required: true })
  quantity: number

  @ApiProperty()
  @Prop({
    type: Variant,
    required: true,
    validator: (v: Variant[]) => {
      return v.length < 5
    },
    message: (props) => `${props.value} is not more than 4`
  })
  variants: Variant[]

  //TODO: Add another status and fix this props
  @Prop({
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status
}

export const ProductSchema = SchemaFactory.createForClass(Product)

ProductSchema.plugin(paginate)
