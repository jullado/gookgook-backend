import {
  Controller,
  Post,
  Body,
  HttpException,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignInDto, SignUpDto } from './dto/users.dto';
import { AuthGuard } from './users.guard';

@Controller('api/v1/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() signInDto: SignInDto) {
    try {
      const res = await this.usersService.signin(
        signInDto.username,
        signInDto.password,
      );
      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    try {
      const res = await this.usersService.signup(
        signUpDto.username,
        signUpDto.password,
      );
      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async signout(@Req() req: any) {
    try {
      const res = await this.usersService.signout(req.body.refresh_token);
      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req: any) {
    try {
      const res = await this.usersService.refresh(req.body.refresh_token);
      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('vouchers')
  async getVoucher(@Req() req: any) {
    try {
      const res = await this.usersService.getVoucher(req.user_id);
      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('voucher/:deal_id')
  async checkVoucher(@Req() req: any) {
    try {
      const res = await this.usersService.checkVoucher(
        req.user_id,
        req.params.deal_id,
      );
      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('voucher/:deal_id')
  async receiveVoucher(@Req() req: any) {
    try {
      const res = await this.usersService.receiveVoucher(
        req.user_id,
        req.params.deal_id,
      );
      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('buy/product/:product_id')
  async buyProduct(@Req() req: any) {
    try {
      const res = await this.usersService.buyProduct(
        req.user_id,
        req.params.product_id,
        req.body?.voucher_id || '',
      );
      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }
}
