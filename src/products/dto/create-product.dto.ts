import { IsNotEmpty, IsOptional, IsUrl, IsUUID } from 'class-validator';
import { ProductCategory } from 'src/common/enums/product.enum';

export class CreateProductDto {
  @IsOptional()
  @IsUrl()
  readonly image: string = '';

  @IsNotEmpty()
  readonly title: string;

  readonly description: string;

  @IsUUID()
  readonly company_id: string;

  readonly price: number = 0;

  @IsNotEmpty()
  readonly category: ProductCategory;

  readonly amount: number = 0;

  readonly unlimited: boolean = false;
}
