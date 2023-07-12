import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ECar, ICar } from 'src/entities/car.entity';

export class CreateCarDTO implements ICar {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: ECar;

  @IsNotEmpty()
  @IsNumber()
  price?: number;
}
