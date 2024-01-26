import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Status, UserRole } from '@src/common/contracts/constant'
import { Transform } from 'class-transformer'
import { HydratedDocument } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'

export type StaffDocument = HydratedDocument<Staff>

@Schema({
  collection: 'staffs',
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
export class Staff {
  constructor(id?: string) {
    this._id = id
  }

  @ApiProperty()
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
    required: true
  })
  email: string

  @ApiProperty()
  @Prop({ type: String, required: true })
  password: string

  @ApiProperty()
  @Prop({ type: String, required: true })
  staffCode: string

  @ApiProperty()
  @Prop({
    type: String,
    required: true
  })
  phone: string

  @ApiProperty()
  @Prop({
    type: String
  })
  avatar: string

  @ApiProperty()
  @Prop({
    enum: UserRole,
    default: UserRole.STAFF
  })
  role: UserRole

  @Prop({
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status
}

export const StaffSchema = SchemaFactory.createForClass(Staff)

StaffSchema.plugin(paginate)
