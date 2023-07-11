import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { LoginUserDTO } from '../dto/login-user.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Permissions } from 'src/decorators/role.decorator';
import { UserFilters } from 'src/utils/pagination';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) body: CreateUserDTO) {
    const result = await this.userService.create(body);
    return { statusCode: 200, message: 'Success.', data: result };
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) body: LoginUserDTO) {
    const result = await this.userService.authenticate(body);
    return { statusCode: 200, message: 'Success.', data: result };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('read:user')
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() filters: UserFilters,
  ) {
    const options = {
      page: page,
      limit: limit,
    };

    const result = await this.userService.getList(options, filters);
    return { statusCode: 200, message: 'Success.', data: result };
  }
}
