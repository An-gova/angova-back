import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    async use(req: any, res: any, next: (error?: any) => void) {

        //by pass des routes de login
        const loginRoutes = ['/auth/login', '/auth/signup', '/auth/refresh', '/fixtures/generate'];
        const isLoginRoute = loginRoutes.some(route => req.url.includes(route));
        if (isLoginRoute) {
            return next();
        }

        const authHeader = req.headers.authorization;
        console.log('Authorization header:', authHeader);
        if (!authHeader) {
            return res.status(401).send('Authorization header is missing');
        }

        const token = authHeader.split(' ')[1].trim();
        console.log('Extracted token:', token);


        if (!token) {
            return res.status(401).send('Token not found');
        }

        const decoded = await this.jwtService.verifyAsync(token);
        console.log('decoded token:', decoded);

        try {
            const decoded = await this.jwtService.verifyAsync(token);
            req.user = decoded;
            console.log('decoded token:', decoded);

            console.log('Authorization header:', authHeader);
            console.log('Token:', token);
            console.log('Decoded token:', decoded);
            console.log("log :" + req.user);
            next();
        } catch (error) {
            return res.status(401).send('Invalid token');
        }
    }
}