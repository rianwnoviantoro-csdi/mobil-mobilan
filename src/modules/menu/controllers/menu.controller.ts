import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Permissions } from 'src/decorators/role.decorator';
import { CreateMenuDTO } from '../dto/create-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('create:menu')
  async create(
    @Body(new ValidationPipe()) body: CreateMenuDTO,
    @Req() req: any,
  ) {
    const result = await this.menuService.create(body, req.user);
    return { statusCode: 200, message: 'Success.', data: result };
  }

  @Get()
  async List(@Query('page') page = 1, @Query('limit') limit = 10) {
    const options = {
      page: page,
      limit: limit,
    };

    const result = await this.menuService.getAllMenu(options);
    return { statusCode: 200, message: 'Success.', data: result };
  }

  @Get(':id')
  async Get(@Param('id') id: string) {
    const result = await this.menuService.findOneById(id);
    return { statusCode: 200, message: 'Success.', data: result };
  }
}
