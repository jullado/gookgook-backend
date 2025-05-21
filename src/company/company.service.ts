import { Injectable, Logger } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name, {
    timestamp: true,
  });

  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  create(createCompanyDto: CreateCompanyDto) {
    this.logger.log('create company');

    const createdCompany = new this.companyModel(createCompanyDto);
    createdCompany.company_id = uuidv4();

    return createdCompany.save();
  }
}
