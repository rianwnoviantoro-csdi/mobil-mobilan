import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IUser } from 'src/entities/user.entity';

export class LoginUserDTO implements IUser {
  @IsEmail()
  email?: string;

  @MinLength(6)
  password?: string;
}
