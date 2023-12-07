import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {UserDocument} from "../user/entities/user.entity";

@Injectable()
export class RolesMiddleware implements NestMiddleware {
    use(req: Request & { user: UserDocument }, res: Response, next: NextFunction) {

        const userRoleName = req.user.role?.name;

        if (userRoleName === 'admin' || userRoleName === 'manager') {
            next();
        } else {
            res.status(403).send('Forbidden access');
        }
    }
}
