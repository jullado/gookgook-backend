import { ConfigService } from '@nestjs/config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionsDocument = HydratedDocument<Sessions>;

@Schema({ versionKey: false, collection: 'sessions' })
export class Sessions {
  @Prop({ type: String, required: true, ref: 'users' })
  user_id: string;

  @Prop({ type: String, required: true })
  refresh_token: string;

  @Prop({
    default: Date.now,
    required: true,
  })
  create_at: Date;
}

export const SessionsSchema = (configService: ConfigService) => {
  const schema = SchemaFactory.createForClass(Sessions);

  const expiresIn = configService.get('jwtExpiresInRefresh');
  schema.index(
    { create_at: 1 },
    { expireAfterSeconds: parseExpireString(expiresIn) },
  );

  return schema;
};

// Helper to convert string like '1d', '15m' to seconds
function parseExpireString(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 86400; // default to 1 day in seconds

  const [, amount, unit] = match;
  const num = parseInt(amount);
  switch (unit) {
    case 's':
      return num;
    case 'm':
      return num * 60;
    case 'h':
      return num * 3600;
    case 'd':
      return num * 86400;
    default:
      return 86400;
  }
}
