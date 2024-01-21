import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Status } from '@common/contracts/constant';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({
  collection: 'customers',
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
    },
  },
})
export class Customer {
  constructor(id?: string) {
    this._id = id;
  }
  @Transform(({ value }) => value?.toString())
  _id: string;

  @ApiProperty()
  @Prop({ type: String, maxlength: 30, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: String, maxlength: 256, required: true })
  email: string;

  @ApiProperty()
  @Prop({
    type: String,
    validate: {
      validator: function (v: string) {
        return /^[+]?\d{10,12}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  })
  phone: string;

  @Prop({
    type: String,
    enum: [Status.ACTIVE, Status.INACTIVE, Status.DELETED],
    default: Status.ACTIVE,
  })
  status: Status;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.plugin(paginate);
