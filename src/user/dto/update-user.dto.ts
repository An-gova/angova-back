import { PartialType } from '@nestjs/mapped-types';
import { SignupDto } from '../../auth/dto/signup.dto';
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(SignupDto) {
  @ApiProperty()
  username?: string;
  @ApiProperty()
  email?: string;
  @ApiProperty()
  password?: string;
  @ApiProperty()
  role?: string;
  @ApiProperty()
  refreshToken?:string;
}
