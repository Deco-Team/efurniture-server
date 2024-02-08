import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, IDDataResponse } from '@common/contracts/dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { Roles } from '@auth/decorators/roles.decorator'
import { StaffService } from '@staff/services/staff.service'
import { CreateStaffDto } from '@staff/dto/staff.dto'
import { UserRole } from '@common/contracts/constant'

@ApiTags('Staff')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard.ACCESS_TOKEN)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new staff'
  })
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(RolesGuard)
  @ApiOkResponse({ type: IDDataResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  createStaff(@Req() req, @Body() createStaffDto: CreateStaffDto) {
    const { _id } = _.get(req, 'user')
    createStaffDto.createdBy = _id
    return this.staffService.createStaff(createStaffDto)
  }
}
