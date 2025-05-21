import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto, EditProductDto } from './dto/deals.dto';

@Controller('api/v1/deal')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  async create(@Body() createDealDto: CreateDealDto) {
    try {
      const res = await this.dealsService.create(createDealDto);
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

  @Get('all')
  async getAll() {
    try {
      const res = await this.dealsService.getAll();
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

  @Get(':deal_id')
  async getOne(@Param('deal_id') deal_id: string) {
    try {
      const res = await this.dealsService.getOne(deal_id);
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

  @Post(':deal_id/add-products')
  async addProducts(
    @Param('deal_id') deal_id: string,
    @Body() body: EditProductDto,
  ) {
    try {
      const res = await this.dealsService.addProducts(deal_id, body.products);
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

  @Delete(':deal_id/remove-products')
  async removeProducts(
    @Param('deal_id') deal_id: string,
    @Body() body: EditProductDto,
  ) {
    try {
      const res = await this.dealsService.removeProducts(
        deal_id,
        body.products,
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
