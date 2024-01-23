import { Module } from '@nestjs/common'
import { JwtAccessStrategy } from '@auth/strategies/jwt-access.strategy'
import { PassportModule } from '@nestjs/passport'
import { CustomerModule } from '@customer/customer.module'
import { AuthService } from '@auth/services/auth.service'
import { AuthController } from '@auth/controllers/auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { JwtRefreshStrategy } from '@auth/strategies/jwt-refresh.strategy'

@Module({
  imports: [
    ConfigModule,
    CustomerModule,
    PassportModule,
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [AuthService]
})
export class AuthModule {}
