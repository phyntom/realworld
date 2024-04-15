import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUserDTO';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  createUser(createUser: CreateUserDto) {
    try {
      this.userRepository.save(createUser);
      return createUser;
    } catch (error) {
      throw new Error('Error creating user');
    }
  }
}
