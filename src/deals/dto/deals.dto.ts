import {
  IsNotEmpty,
  IsUrl,
  IsDateString,
  IsEnum,
  IsNumber,
  IsUUID,
} from 'class-validator';
import {
  DealDiscountType,
  DealCategory,
  DealType,
} from 'src/common/enums/deal.enum';

export class CreateDealDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  @IsUrl()
  readonly image: string;

  @IsNotEmpty()
  readonly description: string;

  @IsUUID()
  readonly company_id: string;

  @IsNotEmpty()
  @IsDateString()
  readonly expires_at: Date;

  @IsNumber()
  readonly discount: number = 0;

  @IsEnum(DealDiscountType)
  @IsNotEmpty()
  readonly discount_type: string;

  @IsEnum(DealType)
  @IsNotEmpty()
  readonly deal_type: string;

  @IsNumber()
  readonly min_price: number = 0;

  @IsNumber()
  readonly max_discount: number = 0;

  @IsEnum(DealCategory)
  @IsNotEmpty()
  readonly category: string;

  @IsNumber()
  readonly amount: number = 0;
}

export class DealsServiceModel {
  deal_id: string;
  title: string;
  image: string;
  description: string;
  companies: CompanyModel;
  status: boolean;
  start_at: Date;
  discount: number;
  discount_type: string;
  category: string;
  expires_at: Date;
  amount: number;
  create_at: Date;
  products: string[];
}

class CompanyModel {
  company_id: string;
  name: string;
  image: string;
  address: string;
  phone: string;
  email: string;
}

export class EditProductDto {
  readonly products: string[] = [];
}
