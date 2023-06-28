import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { LoginUserDTO } from '../dto/login-user.dto';

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
}
