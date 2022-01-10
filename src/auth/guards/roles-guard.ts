import { UserRole } from '../../site-admin/users/schemas/user.schema';
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    console.log('RolesGuard constructed');
  }


  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // TODO: This if statement is not really required since the RolesGuard is no longer a global guard
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    return requiredRoles.includes(req.user.role);
  }
}