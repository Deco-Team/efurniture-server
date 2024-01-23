import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ErrorResponse } from '@common/contracts/dto'
import { LoginReqDto } from '@auth/dto/login.dto'
import { AuthService } from '@auth/services/auth.service'
import { TokenResDto } from '@auth/dto/token.dto'
import { UserSide } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer/login')
  @ApiBody({ type: LoginReqDto })
  @ApiOkResponse({ type: TokenResDto })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async login(@Body() loginReqDto: LoginReqDto): Promise<TokenResDto> {
    const res = await this.authService.login(loginReqDto, UserSide.CUSTOMER)

    return res
  }

  @UseGuards(JwtAuthGuard.REFRESH_TOKEN)
  @Post('customer/refresh')
  @ApiBearerAuth()
  @ApiOkResponse({ type: TokenResDto })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async refreshToken(@Req() req): Promise<TokenResDto> {
    const res = await this.authService.refreshAccessToken(req.user.id, UserSide.CUSTOMER)

    return res
  }
}
