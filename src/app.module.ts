import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'src/config/config.env';
import { MongooseModule } from '@nestjs/mongoose';
import { DealsModule } from './deals/deals.module';
import { CompanyModule } from './company/company.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('dbUri'),
      }),
      inject: [ConfigService],
    }),
    DealsModule,
    CompanyModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
