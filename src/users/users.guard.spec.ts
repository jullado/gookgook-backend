import { AuthGuard } from './users.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthGuard', () => {
  it('should be defined', () => {
    const jwtService = new JwtService();
    const configService = new ConfigService();
    expect(new AuthGuard(jwtService, configService)).toBeDefined();
  });
});
