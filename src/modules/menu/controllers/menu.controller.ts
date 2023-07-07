import {
  Body,
  Controller,
  Post,
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
}
