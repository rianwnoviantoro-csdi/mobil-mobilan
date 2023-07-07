import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUser } from 'src/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissionReq = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissionReq) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    delete user.password;

    return this.matchRoles(permissionReq, user);
  }

  matchRoles(permissionReq: string[], user: IUser): boolean {
    const userPermissions = user.role.permissions.map(({ name }) => name);
    return userPermissions.some(
      (userPermission) => userPermission === permissionReq[0],
    );
  }
}
