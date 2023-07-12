import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IBrand } from 'src/entities/brand.entity';
import { Car, ECar, ICar } from 'src/entities/car.entity';
import { User } from 'src/entities/user.entity';

export class CreateBrandDTO implements IBrand {
  @IsNotEmpty()
  @IsString()
  name?: string;
}
