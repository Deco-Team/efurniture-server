import { ApiProperty } from '@nestjs/swagger'
import { DataResponse  } from '@src/common/contracts/openapi-builder'

export class AnalyticDto {
  @ApiProperty()
  previousCount: number

  @ApiProperty()
  count: number

  @ApiProperty()
  percent: number
}

export class AnalyticResponseDto extends DataResponse(AnalyticDto) {}

