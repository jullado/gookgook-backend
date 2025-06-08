import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Users, UsersSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserVouchers,
  UserVouchersSchema,
} from './schemas/user_vouchers.schema';
import { Deals, DealsSchema } from 'src/deals/schemas/deal.schema';
import { Products, ProductsSchema } from 'src/products/schemas/product.schema';
import { Sessions, SessionsSchema } from './schemas/session.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwtSecretAccess'),
        signOptions: { expiresIn: configService.get('jwtExpiresInAccess') },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwtSecretRefresh'),
        signOptions: { expiresIn: configService.get('jwtExpiresInRefresh') },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    MongooseModule.forFeature([
      { name: UserVouchers.name, schema: UserVouchersSchema },
    ]),
    MongooseModule.forFeature([{ name: Deals.name, schema: DealsSchema }]),
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductsSchema },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Sessions.name,
        useFactory: (configService: ConfigService) =>
          SessionsSchema(configService),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
