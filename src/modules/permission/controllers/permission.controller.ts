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
import { PermissionService } from '../services/permission.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Permissions } from 'src/decorators/role.decorator';
import { CreatePermissionDTO } from '../dto/create-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('create:permission')
  async create(
    @Body(new ValidationPipe()) body: CreatePermissionDTO,
    @Req() req: any,
  ) {
    const result = await this.permissionService.create(body, req.user);
    return { statusCode: 200, message: 'Success.', data: result };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('read:permission')
  async list(@Query('page') page = 1, @Query('limit') limit = 10) {
    const options = {
      page: page,
      limit: limit,
    };

    const result = await this.permissionService.getList(options);
    return { statusCode: 200, message: 'Success.', data: result };
  }
}
