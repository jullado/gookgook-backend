import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ versionKey: false, collection: 'users' })
export class Users {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  user_id: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ default: Date.now })
  create_at: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
