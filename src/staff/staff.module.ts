import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { StaffRepository } from '@staff/repositories/staff.repository'
import { Staff, StaffSchema } from '@staff/schemas/staff.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }])],
  controllers: [],
  providers: [StaffRepository],
  exports: [StaffRepository]
})
export class StaffModule {}
