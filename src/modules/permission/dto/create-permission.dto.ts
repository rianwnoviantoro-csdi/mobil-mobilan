import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { IPermission } from 'src/entities/permission.entity';

export class CreatePermissionDTO implements IPermission {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  code?: string;
}
