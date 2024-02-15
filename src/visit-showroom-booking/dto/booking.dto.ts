import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, MaxLength, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { BookingHistoryDto, CustomerDto } from '@visit-showroom-booking/schemas/booking.schema'
import { Types } from 'mongoose'

export class CreateVisitShowroomBookingDto {
  @ApiProperty({ type: () => CustomerDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto

  @ApiProperty()
  @IsDateString()
  bookingDate: Date

  @ApiProperty({ type: Types.ObjectId, isArray: true, example: ['65b7805c041a5a29734ce110'] })
  @IsNotEmpty()
  interestedCategories: Types.ObjectId[]

  @ApiPropertyOptional()
  @MaxLength(256)
  notes?: string

  bookingHistory?: BookingHistoryDto[]
}
