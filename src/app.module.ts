import { Module } from '@nestjs/common'
import { AcceptLanguageResolver, QueryResolver, HeaderResolver, CookieResolver, I18nModule } from 'nestjs-i18n'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { RouterModule } from '@nestjs/core'

import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { join } from 'path'
import configuration from '@src/config'
import { CommonModule } from '@common/common.module'
import { CustomerModule } from '@customer/customer.module'
import { AuthModule } from '@auth/auth.module'
import { ProductModule } from '@product/product.module'
import { CartModule } from '@cart/cart.module'
import { StaffModule } from '@staff/staff.module'
import { CategoryModule } from '@category/category.module'
import { OrderModule } from '@order/order.module'

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          includeSubfolders: true,
          watch: true
        }
      }),
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['Accept-Language']),
        new CookieResolver(),
        AcceptLanguageResolver
      ],
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbUrl')
      })
    }),
    RouterModule.register([
      {
        path: 'customers',
        module: CustomerModule
      },
      {
        path: 'auth',
        module: AuthModule
      },
      {
        path: 'products',
        module: ProductModule
      },
      {
        path: 'categories',
        module: CategoryModule
      },
      {
        path: 'orders',
        module: OrderModule
      }
    ]),
    CommonModule,
    CustomerModule,
    AuthModule,
    ProductModule,
    CartModule,
    StaffModule,
    CategoryModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
