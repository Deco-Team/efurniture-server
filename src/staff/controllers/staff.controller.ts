import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, IDDataResponse, PaginationQuery } from '@common/contracts/dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { Roles } from '@auth/decorators/roles.decorator'
import { StaffService } from '@staff/services/staff.service'
import { CreateStaffDto, StaffPaginateResponseDto, StaffResponseDto } from '@staff/dto/staff.dto'
import { UserRole } from '@common/contracts/constant'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'

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

  @Get()
  @ApiOperation({
    summary: 'Paginate list staff'
  })
  @ApiOkResponse({ type: StaffPaginateResponseDto })
  @ApiQuery({ type: PaginationQuery })
  getListOrder(@Pagination() paginationParams: PaginationParams) {
    return this.staffService.getStaffList({}, paginationParams)
  }

  @Get(':staffId')
  @ApiOperation({
    summary: 'View staff detail'
  })
  @ApiOkResponse({ type: StaffResponseDto })
  getOrderDetail(@Param('staffId') staffId: string) {
    return this.staffService.getStaffDetails({ _id: staffId })
  }
}
