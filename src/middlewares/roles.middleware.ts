import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from '../role/role.service';

@Injectable()
export class RolesMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly roleService: RoleService,
    ) {}

    async use(req: any, res: any, next: (error?: any) => void) {
        // Exclure les routes de login
        const loginRoutes = ['/auth/login', '/auth/signup', '/auth/refresh'];
        const isLoginRoute = loginRoutes.some(route => req.url.includes(route));
        if (isLoginRoute) {
            return next();
        }

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send('Authorization header is missing');
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = await this.jwtService.verifyAsync(token);
            const roleId = decoded.roleId;

            const userRole = await this.roleService.findOne(roleId);
            console.log("userRole structure:", JSON.stringify(userRole, null, 2));

            const userRoleObject = userRole.toObject();

            const roleName = userRoleObject.role;
            console.log("Role name: " + roleName);

            if (!userRole) {
                return res.status(403).send('Forbidden access: role not found');
            }

            if (roleName === 'admin' || roleName === 'manager') {
                console.log("Délégations nécessaires ok pour accéder à la route solicitée");
                return next();
            } else {
                return res.status(403).send('Forbidden access');
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            return res.status(401).send('Unauthorized');
        }
    }
}
