import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDTO';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async create(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<CreateUserDto | void> {
    return await this.userService.createUser(createUserDto);
  }
}
