import {Body, Controller, Get, HttpException, HttpStatus, Post, Req} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {SignupDto} from "./dto/signup.dto";
import {LoginDto} from "./dto/login.dto";
import {RefreshTokenDto} from "./dto/refresh-token.dto";
import {UserService} from "../user/user.service";

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService,
                private userService: UserService,)
    {
    }

    @Post('/signup')
    signUp(@Body() create: SignupDto) {
        return this.authService.SignUp(create)
    }

    @Post('/login')
    login(@Body() data: LoginDto) {
        console.log("test")
        return this.authService.login(data)
    }

    @Get('/logout')
    logout(@Req() req: Request) {
        this.authService.logout(req['sub']);
    }

    @Post('/refresh')
    async refresh(@Body() refreshDto: RefreshTokenDto) {
        try {
            const user = await this.userService.findById(refreshDto.userId);

            if (!user) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }

              console.log(refreshDto.userId);
              console.log(refreshDto.refreshToken);


            const tokensMatch = await this.userService.compareRefreshTokens(
                refreshDto.userId,
                refreshDto.refreshToken,
            );

            console.log(tokensMatch)
            if (!tokensMatch) {

                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }

            const newAccessToken = await this.authService.refresh(
                refreshDto.userId,
                refreshDto.refreshToken,
            );

            return { accessToken: newAccessToken };
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }
}
