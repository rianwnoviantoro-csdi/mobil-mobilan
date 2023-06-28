import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IUser } from 'src/entities/user.entity';

export class CreateUserDTO implements IUser {
  @IsNotEmpty()
  name?: string;

  @IsEmail()
  email?: string;

  @MinLength(6)
  password?: string;
}
