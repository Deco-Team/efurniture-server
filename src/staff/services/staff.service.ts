import { BadRequestException, Injectable } from '@nestjs/common'
import { StaffRepository } from '@staff/repositories/staff.repository'
import { CreateStaffDto } from '@staff/dto/staff.dto'
import { ProviderRepository } from '@provider/repositories/provider.repository'
import { IDResponse } from '@common/contracts/dto'
import { AuthService } from '@auth/services/auth.service'
import { MailerService } from '@nestjs-modules/mailer'
import { MongoServerError } from 'mongodb'
import { Staff } from '@staff/schemas/staff.schema'
import * as _ from 'lodash'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'

@Injectable()
export class StaffService {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly staffRepository: StaffRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService
  ) {}

  public async createStaff(createStaffDto: CreateStaffDto) {
    const session = await this.connection.startSession()
    session.startTransaction()
    try {
      const provider = await this.providerRepository.findOne({
        conditions: {}
      })
      createStaffDto.providerId = provider._id

      // Generate random password
      const password = Math.random().toString(36).slice(-8)
      createStaffDto.password = await this.authService.hashPassword(password)

      let staff: Staff
      try {
        staff = await this.staffRepository.create(createStaffDto, { session })
      } catch (err) {
        if (err instanceof MongoServerError) {
          const { code, keyPattern, keyValue } = err
          if (code === 11000) {
            if (_.get(keyPattern, 'staffCode') === 1)
              throw new BadRequestException(
                `Mã nhân viên: ${_.get(keyValue, 'staffCode')} đã tổn tại. Vui lòng nhập mã nhân viên khác.`
              )
            if (_.get(keyPattern, 'email') === 1)
              throw new BadRequestException(`Email: ${_.get(keyValue, 'email')} đã tổn tại. Vui lòng nhập email khác.`)
          }
        }
        console.error(err)
        throw err
      }
      // Send email
      try {
        await this.mailerService.sendMail({
          to: createStaffDto.email,
          subject: '[eFurniture] Thông tin đăng nhập hệ thống',
          template: 'invite-staff',
          context: {
            name: `${createStaffDto.firstName} ${createStaffDto.lastName}`,
            email: createStaffDto.email,
            password
          }
        })
      } catch (error) {
        console.error(`send mail error=${error}, stack=${JSON.stringify(error['stack'])}`)
        if (error['responseCode'] === 501) {
          console.error('501 can not send mail')
          throw new BadRequestException('Dịch vụ email đang gặp sự cố. Vui lòng thử lại sau!')
        } else {
          throw error
        }
      }

      await session.commitTransaction()
      return new IDResponse(staff._id)
    } catch (error) {
      await session.abortTransaction()
      throw error
    }
  }
}
