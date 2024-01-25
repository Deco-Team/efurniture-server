import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsPositive } from 'class-validator'

export class PaginationQuery {
  @ApiProperty({
    type: Number,
    description: 'Page number',
    example: 1,
    default: 1
  })
  @ApiPropertyOptional()
  @IsPositive()
  page = 1

  @ApiProperty({
    type: Number,
    description: 'Number of items per page',
    example: 10,
    default: 10
  })
  @ApiPropertyOptional()
  @IsPositive()
  limit = 10

  @ApiProperty({
    type: String,
    example: 'field1.asc_field2.desc',
    description: 'Sorting criteria'
  })
  @ApiPropertyOptional()
  sort: Record<string, 1 | -1>
}

export class PaginateDto {
  @ApiProperty({ type: Number })
  @ApiPropertyOptional()
  @IsPositive()
  page = 1

  @ApiProperty({ type: Number })
  @ApiPropertyOptional()
  @IsPositive()
  limit = 10

  @ApiProperty({ type: String, example: 'field1.asc_field2.desc' })
  @ApiPropertyOptional()
  sort: Record<string, 1 | -1>


export class BooleanResponseDto {
  @ApiProperty()
  success: boolean
}

export class ResponseSuccessDto {
  @ApiProperty({ default: BooleanResponseDto })
  data: BooleanResponseDto
}

export class ErrorResponse {
  @ApiProperty()
  error: string

  @ApiProperty()
  message: string

  @ApiProperty()
  data: any
}
