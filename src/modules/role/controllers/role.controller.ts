import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDTO } from '../dto/create-role.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body(new ValidationPipe()) body: CreateRoleDTO) {
    const result = await this.roleService.create(body);
    return { statusCode: 200, message: 'Success.', data: result };
  }
}
