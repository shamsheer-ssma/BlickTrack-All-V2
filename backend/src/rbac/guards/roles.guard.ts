import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    console.log('🔍 [RBAC DEBUG] RolesGuard check', {
      requiredRoles: requiredRoles,
      hasRequiredRoles: !!requiredRoles
    });
    
    if (!requiredRoles) {
      console.log('🔍 [RBAC DEBUG] No roles required, allowing access');
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    console.log('🔍 [RBAC DEBUG] User data', {
      hasUser: !!user,
      userRole: user?.role,
      userEmail: user?.email,
      userId: user?.id
    });
    
    if (!user || !user.role) {
      console.log('🔍 [RBAC DEBUG] No user or role, denying access');
      return false;
    }
    
    const hasAccess = requiredRoles.some((role) => user.role === role);
    console.log('🔍 [RBAC DEBUG] Access check result', {
      userRole: user.role,
      requiredRoles: requiredRoles,
      hasAccess: hasAccess
    });
    
    return hasAccess;
  }
}
