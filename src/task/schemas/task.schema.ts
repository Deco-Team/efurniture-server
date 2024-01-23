import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { HydratedDocument } from 'mongoose'

export type TaskDocument = HydratedDocument<Task>

@Schema({
  collection: 'tasks',
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
export class Task {
  constructor(id?: string) {
    this._id = id
  }

  @Transform(({ value }) => value?.toString())
  _id: string

  @ApiProperty()
  @Prop({ type: String, maxlength: 30, required: true })
  title: string

  @ApiProperty()
  @Prop({ type: String, maxlength: 512, required: true })
  description: string

  @ApiProperty()
  @Prop({ type: Date, required: true })
  dueDate: Date

  @ApiProperty()
  @Prop({ type: Date, required: true })
  completionDate: Date
}
