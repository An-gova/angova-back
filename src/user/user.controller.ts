import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus, Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import  { SignupDto} from "../auth/dto/signup.dto";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @ApiBearerAuth('accessToken')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth('accessToken')
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }


  @ApiBearerAuth('accessToken')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }


  @ApiBearerAuth('accessToken')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
