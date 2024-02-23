import { Injectable } from '@nestjs/common'
import { StaffRepository } from '@staff/repositories/staff.repository'
import { IDResponse } from '@common/contracts/dto'
import * as _ from 'lodash'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection, FilterQuery } from 'mongoose'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { Status, TaskType, UserRole } from '@common/contracts/constant'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { Task } from '@task/schemas/task.schema'
import { TaskRepository } from '@task/repositories/task.repository'
import { CreateShippingTaskDto } from '@task/dto/task.dto'
import { OrderService } from '@order/services/order.service'

@Injectable()
export class TaskService {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly staffRepository: StaffRepository,
    private readonly taskRepository: TaskRepository,
    private readonly orderService: OrderService
  ) {}

  public async create(createShippingTaskDto: CreateShippingTaskDto) {
    // Execute in transaction
    const session = await this.connection.startSession()
    session.startTransaction()
    try {
      // 1. Validate reporter and assignee
      const reporter = await this.staffRepository.findOne({
        conditions: {
          _id: createShippingTaskDto.reporterId
        },
        projection: '-password'
      })
      const assignee = await this.staffRepository.findOne({
        conditions: {
          _id: createShippingTaskDto.assigneeId
        },
        projection: '-password'
      })
      if (
        !assignee ||
        assignee.status !== Status.ACTIVE ||
        assignee.role !== UserRole.DELIVERY_STAFF ||
        reporter?.providerId.toString() !== assignee.providerId.toString()
      ) {
        throw new AppException(Errors.DELIVERY_STAFF_NOT_FOUND)
      }

      // 2. Update order status to DELIVERING
      await this.orderService.deliveryOrder(
        createShippingTaskDto.orderId,
        assignee._id.toString(),
        UserRole.DELIVERY_STAFF,
        session
      )

      // 3. Create shipping task
      const task = await this.taskRepository.create(
        {
          ...createShippingTaskDto,
          type: TaskType.SHIPPING,
          reporter,
          assignee,
        },
        { session }
      )

      // 4. Send email/notification to customer
      // 5. Send notification to staff

      await session.commitTransaction()
      return new IDResponse(task._id)
    } catch (error) {
      await session.abortTransaction()
      console.error(error)
      throw error
    }
  }

  public async paginate(filter: FilterQuery<Task>, paginationParams: PaginationParams) {
    const result = await this.taskRepository.paginate(
      {
        status: {
          $ne: Status.DELETED
        },
        ...filter
      },
      { ...paginationParams }
    )
    return result
  }
}
