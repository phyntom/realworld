import { UserEntity } from '@app/user/user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUserDTO';
import { UserResponseInterface } from './types/userResponse';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    const createdUser = await this.userRepository.save(newUser);
    return this.buildUserResponse(createdUser);
  }
  generateJwt(userEntity: UserEntity) {
    return sign(
      {
        id: userEntity.id,
        email: userEntity.email,
      },
      'secret',
      { expiresIn: '24h' },
    );
  }
  buildUserResponse(userEntity: UserEntity): UserResponseInterface {
    return {
      user: {
        ...userEntity,
        token: this.generateJwt(userEntity),
      },
    };
  }
}
