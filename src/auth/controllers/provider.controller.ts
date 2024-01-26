import { Body, Controller, Post } from "@nestjs/common"
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { UserSide } from "@common/contracts/constant"
import { ErrorResponse } from "@common/contracts/dto"
import { LoginReqDto } from "@auth/dto/login.dto"
import { ResponseTokenDto, TokenResDto } from "@auth/dto/token.dto"
import { AuthService } from "@auth/services/auth.service"

@ApiTags('Auth - Provider')
@Controller('provider')
export class AuthProviderController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginReqDto })
  @ApiOkResponse({ type: ResponseTokenDto })
  @ApiBadRequestResponse({ type: ErrorResponse })
  async login(@Body() loginReqDto: LoginReqDto): Promise<TokenResDto> {
    return await this.authService.login(loginReqDto, UserSide.PROVIDER)
  }
}