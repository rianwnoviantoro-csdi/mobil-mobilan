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
import { CarService } from '../services/car.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Permissions } from 'src/decorators/role.decorator';
import { CreateCarDTO } from '../dto/create-brand.dto';
import { UserFilters } from 'src/utils/pagination';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('write:car')
  async create(
    @Body(new ValidationPipe()) body: CreateCarDTO,
    @Req() req: any,
  ) {
    const result = await this.carService.create(body, req.user);
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

    const result = await this.carService.getAllCar(options, filters);
    return { statusCode: 200, message: 'Success.', data: result };
  }
}
