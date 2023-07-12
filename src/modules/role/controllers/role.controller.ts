import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDTO } from '../dto/create-role.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Permissions } from 'src/decorators/role.decorator';
import { UserFilters } from 'src/utils/pagination';
import { ReassignPermissionDTO } from '../dto/reassign-permission.dto';

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
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() filters: UserFilters,
  ) {
    const options = {
      page: page,
      limit: limit,
    };

    const result = await this.roleService.getList(options, filters);
    return { statusCode: 200, message: 'Success.', data: result };
  }

  @Patch(':id/assign-permission')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('update:role')
  async assignPermission(
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: ReassignPermissionDTO,
    @Req() req: any,
  ) {
    const result = await this.roleService.assignPermission(id, body, req);

    return result;
  }

  @Patch(':id/demote-permission')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('update:role')
  async demotePermission(
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: ReassignPermissionDTO,
    @Req() req: any,
  ) {
    const result = await this.roleService.demotePermission(id, body, req);

    return result;
  }
}
