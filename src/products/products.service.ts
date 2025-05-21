import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Products } from './schemas/product.schema';
import { Model } from 'mongoose';
import { Company } from 'src/company/schemas/company.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name, {
    timestamp: true,
  });

  constructor(
    @InjectModel(Products.name) private productModel: Model<Products>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    this.logger.log('createProductDto: ', createProductDto);

    try {
      // check company exists
      const company = await this.companyModel
        .findOne({ company_id: createProductDto.company_id })
        .exec();

      if (!company) {
        throw new BadRequestException('Company not found');
      }

      const product = new this.productModel(createProductDto);
      product.product_id = uuidv4();

      return await product.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    this.logger.log('findAll');

    return this.productModel
      .aggregate<Products[]>([
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
  }

  async findById(id: string) {
    this.logger.log(`findById: ${id}`);

    const res = await this.productModel
      .aggregate<Products[]>([
        { $match: { product_id: id } },
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
      throw new BadRequestException('Product not found');
    }

    return res[0];
  }
}
