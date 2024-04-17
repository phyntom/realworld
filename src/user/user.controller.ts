import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/userResponse';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';
import { UserEntity } from './user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async create(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const newUser = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(newUser);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const loginUser = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(loginUser);
  }

  @Get('user')
  async currentUser(@Req() req: Request): Promise<UserResponseInterface> {
    const currentUser = <UserEntity>req['user'];
    return this.userService.buildUserResponse(currentUser);
  }
}
