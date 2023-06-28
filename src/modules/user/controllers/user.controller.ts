import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) body: CreateUserDTO) {
    const result = await this.userService.create(body);
    return { statusCode: 200, message: 'Success.', data: result };
  }
}
