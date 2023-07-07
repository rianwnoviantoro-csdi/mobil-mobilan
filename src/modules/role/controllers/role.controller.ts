import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDTO } from '../dto/create-role.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Permissions } from 'src/decorators/role.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('create:role')
  async create(
    @Body(new ValidationPipe()) body: CreateRoleDTO,
    @Req() req: any,
  ) {
    const result = await this.roleService.create(body, req.user);
    return { statusCode: 200, message: 'Success.', data: result };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('read:role')
  async list() {
    const result = await this.roleService.getList();
    return { statusCode: 200, message: 'Success.', data: result };
  }
}
