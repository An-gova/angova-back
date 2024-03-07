import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserDocument } from "../user/entities/user.entity";

@Injectable()
export class RolesMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const loginRoutes = ['/auth/login', '/auth/signup'];

        const isLoginRoute = loginRoutes.some(route => req.url.includes(route));

        if (isLoginRoute) {
            return next();
        }

        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        const userRoleName = (req.user as UserDocument).role?.name;

        if (userRoleName === 'admin' || userRoleName === 'manager') {
            return next();
        } else {
            return res.status(403).send('Forbidden access');
        }
    }
}
