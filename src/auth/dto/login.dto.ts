import { IsNotEmpty, IsString, IsEmail, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto{

    @IsNotEmpty()
    @ApiProperty()
    @IsEmail({},{message: "Please enter correct credential"})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    @MinLength(8)
    readonly password: string;


}