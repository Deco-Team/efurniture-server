import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, IDDataResponse, PaginationQuery } from '@common/contracts/dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { Roles } from '@auth/decorators/roles.decorator'
import { StaffService } from '@staff/services/staff.service'
import { UserRole } from '@common/contracts/constant'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { TaskService } from '@task/services/task.service'
import { CreateShippingTaskDto, FilterTaskDto, TaskPaginateResponseDto } from '@task/dto/task.dto'

@ApiTags('Task')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard.ACCESS_TOKEN)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService, private readonly staffService: StaffService) {}

  @Post('shipping')
  @ApiOperation({
    summary: 'Change order status to DELIVERING and Create new shipping task'
  })
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(RolesGuard)
  @ApiOkResponse({ type: IDDataResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  create(@Req() req, @Body() createShippingTaskDto: CreateShippingTaskDto) {
    const { _id } = _.get(req, 'user')
    createShippingTaskDto.reporterId = _id
    return this.taskService.create(createShippingTaskDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Paginate list task (CONSULTANT_STAFF, DELIVERY_STAFF just can see own tasks)'
  })
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CONSULTANT_STAFF, UserRole.DELIVERY_STAFF)
  @UseGuards(RolesGuard)
  @ApiOkResponse({ type: TaskPaginateResponseDto })
  @ApiQuery({ type: PaginationQuery })
  async getListStaff(@Req() req, @Pagination() paginationParams: PaginationParams, @Query() filterTaskDto: FilterTaskDto) {
    const { _id, role } = _.get(req, 'user')

    const providerId = await this.staffService.getProviderId(_id)
    filterTaskDto['reporter.providerId'] = providerId

    if ([UserRole.CONSULTANT_STAFF, UserRole.DELIVERY_STAFF].includes(role)) {
      filterTaskDto['assignee._id'] = _id
    }
    return this.taskService.paginate(filterTaskDto, paginationParams)
  }
}
