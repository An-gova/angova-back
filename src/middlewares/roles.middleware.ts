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
        const loginRoutes = ['/auth/login', '/auth/signup'];
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
            const roleId = decoded.roleId; // Assurez-vous que le token contient 'roleId'

            // Récupérer le rôle correspondant à l'ID
            const userRole = await this.roleService.findOne(roleId);
            console.log("userRole structure:", JSON.stringify(userRole, null, 2));

            // Convertir le document Mongoose en un objet JavaScript standard
            const userRoleObject = userRole.toObject();

            // Maintenant, accéder à la propriété 'role' de l'objet converti
            const roleName = userRoleObject.role;
            console.log("Role name: " + roleName);

            if (!userRole) {
                return res.status(403).send('Forbidden access: role not found');
            }

            // Votre logique de vérification du rôle ici...
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
