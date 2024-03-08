import {Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

type JwtPayload = {
    sub: string;
    email: string;
    role: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }
    validate(payload: JwtPayload) {
        console.log('Token extracted from request:', this.jwtService.decode(payload.sub));
        if (!payload.role) {
            throw new UnauthorizedException('Role not found in token');
        }
        return payload;
    }

}
