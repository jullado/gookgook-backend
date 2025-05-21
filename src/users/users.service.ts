import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Users } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword, comparePassword } from '../common/utils/app.bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserVouchers } from './schemas/user_vouchers.schema';
import { Deals } from '../deals/schemas/deal.schema';
import { ReceiveVoucherServiceDto } from './dto/user_voucher.dto';
import { DealDiscountType, DealType } from 'src/common/enums/deal.enum';
import { Products } from 'src/products/schemas/product.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name, {
    timestamp: true,
  });

  constructor(
    private jwtService: JwtService,
    @InjectModel(Users.name) private userModel: Model<Users>,
    @InjectModel(UserVouchers.name) private voucherModel: Model<UserVouchers>,
    @InjectModel(Deals.name) private dealModel: Model<Deals>,
    @InjectModel(Products.name) private productModel: Model<Products>,
  ) {}

  async signin(username: string, password: string) {
    this.logger.log(`signin: ${username}`);

    // check if user exists
    const user = await this.userModel.findOne({ username: username }).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // check if password is correct
    const compare = await comparePassword(password, user.password);
    if (!compare) {
      throw new UnauthorizedException('Incorrect password');
    }

    // create and return token
    const payload = { user_id: user.user_id, username: username };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token: access_token,
    };
  }

  async signup(username: string, password: string) {
    // check if user exists
    const find_user = await this.userModel
      .findOne({ username: username })
      .exec();
    if (find_user) {
      throw new BadRequestException('User already exists');
    }

    // hash password
    password = await hashPassword(password);

    // create user
    const user = await this.userModel.findOneAndUpdate(
      { username: username },
      { user_id: uuidv4(), username: username, password: password },
      { upsert: true, new: true },
    );
    if (!user) {
      throw new BadRequestException('User not created');
    }

    this.logger.log(`signup: ${username}`);

    return {
      user_id: user.user_id,
      username: user.username,
    };
  }

  async getVoucher(user_id: string) {
    this.logger.log(`getVoucher: ${user_id}`);

    // check if user exists
    const user = await this.userModel.findOne({ user_id: user_id }).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // get voucher
    const voucher: ReceiveVoucherServiceDto[] = await this.voucherModel
      .aggregate([
        { $match: { user_id: user_id } },
        {
          $lookup: {
            from: 'deals',
            localField: 'deal_id',
            foreignField: 'deal_id',
            as: 'deals',
          },
        },
        { $unwind: { path: '$deals' } },
        {
          $lookup: {
            from: 'companies',
            localField: 'deals.company_id',
            foreignField: 'company_id',
            as: 'companies',
          },
        },
        { $unwind: { path: '$companies' } },
        {
          $project: {
            _id: 0,
            user_id: 0,
            deal_id: 0,
            'deals._id': 0,
            'deals.company_id': 0,
            'companies._id': 0,
          },
        },
      ])
      .exec();

    return voucher;
  }

  async receiveVoucher(user_id: string, deal_id: string) {
    this.logger.log(`ReceiveVoucher: ${user_id}, ${deal_id}`);

    // check if user exists
    const user = await this.userModel.findOne({ user_id: user_id }).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // check if deal exists
    const deal = await this.dealModel.findOne({ deal_id: deal_id }).exec();
    if (!deal) {
      throw new BadRequestException('Deal not found');
    }

    // check if deal type is active
    if (deal.deal_type !== DealType.Active) {
      throw new BadRequestException('Deal is not active');
    }

    // check if deal is available
    if (deal.amount === 0 || !deal.status) {
      throw new BadRequestException('Deal is not available');
    }

    // check if deal is expired
    if (deal.expires_at < new Date()) {
      throw new BadRequestException('Deal is expired');
    }

    // check if user already has a voucher for this deal
    const voucher = await this.voucherModel
      .findOne({ deal_id: deal_id, user_id: user_id })
      .exec();
    if (voucher) {
      throw new BadRequestException('User already has a voucher for this deal');
    }

    const voucher_id = uuidv4();
    const session = await this.voucherModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // create voucher
        const resVoucher = await this.voucherModel.findOneAndUpdate(
          { deal_id: deal_id, user_id: user_id },
          {
            voucher_id: voucher_id,
            deal_id: deal_id,
            user_id: user_id,
            redeem: false,
          },
          { upsert: true, new: true },
        );
        if (!resVoucher) {
          throw new Error('Voucher not created');
        }

        // decrement amount of deal
        await this.dealModel
          .findOneAndUpdate(
            { deal_id: deal_id, amount: { $gt: 0 } },
            { amount: deal.amount - 1 },
            { session },
          )
          .exec();
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    } finally {
      await session.endSession();
    }

    return {
      voucher_id: voucher_id,
      deal_id: deal.deal_id,
      title: deal.title,
    };
  }

  async checkVoucher(user_id: string, deal_id: string) {
    this.logger.log(`checkVoucher: ${user_id} ${deal_id}`);

    // check if user exists
    const user = await this.userModel.findOne({ user_id: user_id }).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // get voucher
    const voucher = await this.voucherModel
      .findOne({ deal_id: deal_id, user_id: user_id })
      .exec();

    return voucher ? true : false;
  }

  async buyProduct(user_id: string, product_id: string, voucher_id: string) {
    this.logger.log(`buyProduct: ${user_id} ${product_id} ${voucher_id}`);

    // check if user exists
    const user = await this.userModel.findOne({ user_id: user_id }).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // check if product exists
    const product = await this.productModel
      .findOne({ product_id: product_id })
      .exec();
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // check if voucher exists
    const voucher = await this.voucherModel
      .findOne({ voucher_id: voucher_id, user_id: user_id })
      .exec();

    // check if voucher is redeem
    let deal = {} as Deals;
    if (voucher) {
      if (voucher.redeem) {
        throw new BadRequestException('Voucher already redeemed');
      }

      // check deals
      deal = (await this.dealModel
        .findOne({ deal_id: voucher.deal_id })
        .exec()) as Deals;
      if (!deal) {
        throw new BadRequestException('Deal not found');
      }
      if (!deal.status) {
        throw new BadRequestException('Deal is not available');
      }
      if (deal.expires_at < new Date()) {
        throw new BadRequestException('Deal is expired');
      }
    }

    // run transaction
    const session = await this.productModel.db.startSession();
    try {
      await session.withTransaction(async () => {
        // decrement amount of product
        await this.productModel
          .findOneAndUpdate(
            { product_id: product_id, amount: { $gt: 0 } },
            { amount: product.amount - 1 },
            { session },
          )
          .exec();

        // update voucher
        let price = product.price;
        if (voucher) {
          price = this.calculatePriceWithDiscount(price, deal);
          voucher.redeem = true;
          await voucher.save();
        }

        // ตัดเงิน-รับเงิน ในระบบ ...
        this.logger.log(`ชําระเงิน ${price} บาท`);
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    } finally {
      await session.endSession();
    }

    return { message: 'Product bought' };
  }

  private calculatePriceWithDiscount(price: number, deal: Deals): number {
    let discount = 0;
    switch (deal.discount_type) {
      case DealDiscountType.Fixed:
        discount = deal.discount;
        break;
      case DealDiscountType.Percentage:
        discount = (deal.discount / 100) * price;
        break;
      case DealDiscountType.Free:
        discount = price;
        break;
    }
    if (deal.max_discount) {
      discount = Math.min(discount, deal.max_discount);
    }
    discount = Math.min(discount, price);

    return Math.max(price - discount, 0);
  }
}
