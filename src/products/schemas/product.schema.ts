import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProductCategory } from 'src/common/enums/product.enum';

export type ProductsDocument = HydratedDocument<Products>;

@Schema({ versionKey: false, collection: 'products' })
export class Products {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  product_id: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, required: true, ref: 'companies' })
  company_id: string;

  @Prop({ type: Number, default: 0 })
  price: number;

  @Prop({ type: String, required: true, enum: ProductCategory })
  category: ProductCategory;

  @Prop({ type: Number, default: 0 })
  amount: number;

  @Prop({ type: Boolean, default: false })
  unlimited: boolean;

  @Prop({ default: Date.now })
  create_at: Date;

  @Prop({ default: Date.now })
  update_at: Date;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
