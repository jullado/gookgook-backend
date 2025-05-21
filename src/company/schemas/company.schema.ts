import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ versionKey: false, collection: 'companies' })
export class Company {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  company_id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  email: string;

  @Prop({ default: Date.now })
  create_at: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
