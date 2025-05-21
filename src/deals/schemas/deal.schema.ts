import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  DealCategory,
  DealDiscountType,
  DealType,
} from 'src/common/enums/deal.enum';

export type DealsDocument = HydratedDocument<Deals>;

@Schema({ versionKey: false, collection: 'deals' })
export class Deals {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  deal_id: string;

  @Prop({ type: String, required: true, enum: DealType })
  deal_type: DealType;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  company_id: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: Date, default: Date.now })
  start_at: Date;

  @Prop({ type: Date, required: true })
  expires_at: Date;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: String, required: true, enum: DealDiscountType })
  discount_type: DealDiscountType;

  @Prop({ type: Number, default: 0 })
  min_price: number;

  @Prop({ type: Number, default: 0 })
  max_discount: number;

  @Prop({ type: String, required: true, enum: DealCategory })
  category: DealCategory;

  @Prop({ type: Number, default: 0 })
  amount: number;

  @Prop({ type: Array<string>, default: [] })
  products: string[];

  @Prop({ default: Date.now })
  create_at: Date;

  @Prop({ default: Date.now })
  update_at: Date;
}

export const DealsSchema = SchemaFactory.createForClass(Deals);
