
import { Reflector } from '@nestjs/core';
import { Role } from 'src/modules/user/enums/role.enum';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ROLES_KEY } from 'src/decorators/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Validar si el usuario tiene algún rol
        if (!user || !user.roles) {
            throw new UnauthorizedException('No tiene permisos para acceder a esta ruta');
        }

        // Verificar si el usuario tiene uno de los roles requeridos
        const hasRole = () => requiredRoles.some((role) => user.roles.includes(role));
        if (!hasRole()) {
            throw new UnauthorizedException('No tiene permisos para acceder a esta ruta');
        }

        return true;
    }
}