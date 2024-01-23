import { Global, Module } from '@nestjs/common'
import { AppLogger } from '@common/services/app-logger.service'
import { HelperService } from '@common/services/helper.service'

@Global()
@Module({
  providers: [AppLogger, HelperService],
  exports: [AppLogger, HelperService]
})
export class CommonModule {}
