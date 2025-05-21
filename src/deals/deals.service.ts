import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deals } from './schemas/deal.schema';
import { CreateDealDto, DealsServiceModel } from './dto/deals.dto';
import { v4 as uuidv4 } from 'uuid';
import { Products } from 'src/products/schemas/product.schema';

@Injectable()
export class DealsService {
  private readonly logger = new Logger(DealsService.name, {
    timestamp: true,
  });

  constructor(
    @InjectModel(Deals.name) private dealModel: Model<Deals>,
    @InjectModel(Products.name) private productsModel: Model<Products>,
  ) {}

  async create(deal: CreateDealDto) {
    this.logger.log(`create: ${JSON.stringify(deal)}`);

    try {
      const createdDeal = new this.dealModel(deal);
      createdDeal.deal_id = uuidv4();

      return await createdDeal.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getAll() {
    return this.dealModel
      .aggregate<DealsServiceModel[]>([
        { $match: { status: true } },
        {
          $lookup: {
            from: 'companies',
            localField: 'company_id',
            foreignField: 'company_id',
            as: 'companies',
          },
        },
        { $unwind: { path: '$companies' } },
        {
          $project: {
            _id: 0,
            company_id: 0,
            'companies._id': 0,
          },
        },
        { $sort: { create_at: -1, status: -1 } },
      ])
      .exec();
  }

  async getOne(deal_id: string) {
    const res = await this.dealModel
      .aggregate<DealsServiceModel[]>([
        { $match: { deal_id: deal_id, status: true } },
        {
          $lookup: {
            from: 'companies',
            localField: 'company_id',
            foreignField: 'company_id',
            as: 'companies',
          },
        },
        { $unwind: { path: '$companies' } },
        {
          $project: {
            _id: 0,
            company_id: 0,
            'companies._id': 0,
          },
        },
      ])
      .exec();

    if (res.length === 0) {
      throw new BadRequestException('Deal not found');
    }

    return res[0];
  }

  async addProducts(deal_id: string, products: string[]) {
    this.logger.log(`addProducts: ${deal_id}, ${JSON.stringify(products)}`);

    try {
      // check if deal exists
      const deal: Deals | null = await this.dealModel
        .findOne({ deal_id: deal_id })
        .exec();

      if (!deal) {
        throw new BadRequestException('Deal not found');
      }

      // check if products exists
      const productsInCompany: Products[] = await this.productsModel
        .find({
          product_id: { $in: products },
          company_id: deal.company_id,
        })
        .exec();

      // check company products
      if (productsInCompany.length !== products.length) {
        throw new BadRequestException('Products not found in company');
      }

      return this.dealModel
        .updateOne(
          { deal_id: deal_id },
          {
            $push: { products: { $each: products } },
            $set: { update_at: Date.now() },
          },
        )
        .exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  removeProducts(deal_id: string, products: string[]) {
    this.logger.log(`removeProducts: ${deal_id}, ${JSON.stringify(products)}`);
    try {
      return this.dealModel
        .updateOne(
          { deal_id: deal_id },
          { $pull: { products: products }, $set: { update_at: Date.now() } },
        )
        .exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
