import { Permission } from 'src/entities/permission.entity';
import { IRole } from 'src/entities/role.entity';

export class ReassignPermissionDTO implements IRole {
  permissions?: Permission[];
}
