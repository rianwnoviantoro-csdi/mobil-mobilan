import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { IRole } from 'src/entities/role.entity';

export class CreateRoleDTO implements IRole {
  @IsNotEmpty()
  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsString()
  name?: string;
}
