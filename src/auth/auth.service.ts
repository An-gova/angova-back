import {BadRequestException, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import {ConfigService} from "@nestjs/config";
import {LoginDto} from "./dto/login.dto";
import {RefreshTokenDto} from "./dto/refresh-token.dto"
import {Role} from "../role/entities/role.entity";
import {name} from "ts-jest/dist/transformers/hoist-jest";
import {rootCertificates} from "tls";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService,
    ) {


    }


    async SignUp(SignupDto) {
        const userExists = await this.userService.findByEmail(
            SignupDto.email,
        );
        if (userExists) {
            throw new BadRequestException('User already exists');
        }
        const hash = await this.hashData(SignupDto.password)
        const user = await this.userService.create({
            ...SignupDto,
            password: hash,
        });
        const tokens = await this.getTokens(user._id, user.role);
        await this.refresh(user._id, tokens.refreshToken);
        return tokens;
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async login(data: LoginDto) {
        const user = await this.userService.findByEmail(data.email);
        console.log(data.password, " ", data.email)
        if (!user) throw new BadRequestException('User does not exist');
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new HttpException({message: 'email or password is/are incorrect'}, HttpStatus.UNAUTHORIZED);
        }
        const tokens = await this.getTokens(user._id, user.role._id);
        console.log(user)
        await this.refresh(user._id, tokens.refreshToken);
        return {tokens};
    }

    async logout(userId: string) {
        return this.userService.update(userId, {refreshToken: null});
    }

    async refresh(userId: string, RefreshTokenDto: string)
    {
        const hashedRefreshToken = await this.hashData(RefreshTokenDto);
        await this.userService.update(userId, {
            refreshToken: hashedRefreshToken,
        });
        const newAccessToken = this.jwtService.sign({ sub: userId });
        const newRefreshToken = this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });
        return { newAccessToken, newRefreshToken };
    }

    async getTokens(userId: string, roleId: Role) {
        
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                     userId,
                     roleId,
                },
                {
                    secret: this.configService.get<string>('JWT_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                     userId,
                     roleId,
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }


}



