import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BrandService } from '../services/brand.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { CreateBrandDTO } from '../dto/create-brand.dto';
import { UserFilters } from 'src/utils/pagination';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Permissions('create:car')
  async create(
    @Body(new ValidationPipe()) body: CreateBrandDTO,
    @Req() req: any,
  ) {
    const result = await this.brandService.create(body, req.user);
    return { statusCode: 200, message: 'Success.', data: result };
  }

  @Get()
  async List(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() filters: UserFilters,
  ) {
    const options = {
      page: page,
      limit: limit,
    };

    const result = await this.brandService.getAllBrand(options, filters);
    return { statusCode: 200, message: 'Success.', data: result };
  }
}
