import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IMenu, Menu } from 'src/entities/menu.entity';

export class CreateMenuDTO implements IMenu {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  parent?: Menu;

  @IsOptional()
  @IsString()
  path?: string;
}
