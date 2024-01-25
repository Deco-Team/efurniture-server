import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { Gender, Status } from '@common/contracts/constant'
import { EMAIL_REGEX, PHONE_REGEX, URL_REGEX } from '@src/config'

export type CustomerDocument = HydratedDocument<Customer>

@Schema({
  collection: 'customers',
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
export class Customer {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @ApiProperty()
  @Prop({ type: String, maxlength: 30, required: true })
  firstName: string

  @ApiProperty()
  @Prop({ type: String, maxlength: 30, required: true })
  lastName: string

  @ApiProperty()
  @Prop({
    type: String,
    validate: {
      validator: (v: string) => {
        return EMAIL_REGEX.test(v)
      },
      message: (props) => `${props.value} is not a valid email!`
    },
    required: true
  })
  email: string

  @ApiProperty()
  @Prop({
    type: String,
    validate: {
      validator: (v: string) => {
        return PHONE_REGEX.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`
    },
    required: true
  })
  phone: string

  @ApiProperty()
  @Prop({ type: Array<String>, required: true })
  address: string[]

  @ApiProperty()
  @Prop({ type: Date })
  dateOfBirth: Date

  @ApiProperty()
  @Prop({ enum: Gender, default: Gender.OTHER })
  gender: Gender

  @ApiProperty()
  @Prop({
    type: String,
    validate: {
      validator: (v: string) => {
        return URL_REGEX.test(v)
      },
      message: (props) => `${props.value} is not a valid image url!`
    }
  })
  avatar: string

  @ApiProperty()
  @Prop({ type: String, required: true })
  password: string

  @ApiProperty()
  @Prop({ type: Date, default: Date.now() })
  lastLoginDate: Date

  @Prop({
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status
}

export const CustomerSchema = SchemaFactory.createForClass(Customer)

CustomerSchema.plugin(paginate)
