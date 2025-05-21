import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserVouchersDocument = HydratedDocument<UserVouchers>;

@Schema({ versionKey: false, collection: 'user_vouchers' })
export class UserVouchers {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  voucher_id: string;

  @Prop({ type: String, required: true, ref: 'deals' })
  deal_id: string;

  @Prop({ type: String, required: true, ref: 'users' })
  user_id: string;

  @Prop({ type: Boolean, default: false })
  redeem: boolean;

  @Prop({ default: Date.now })
  create_at: Date;
}

export const UserVouchersSchema = SchemaFactory.createForClass(UserVouchers);
