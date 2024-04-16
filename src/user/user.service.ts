import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUserDto';
import { UserResponseInterface } from './types/userResponse';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { LoginUserDto } from './dto/loginUserDto';
import { compare } from 'bcrypt';

config();

const configService = new ConfigService();

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    const username = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userByEmail || username) {
      throw new HttpException(
        'Email or Username already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    const createdUser = await this.userRepository.save(newUser);
    this.logger.log(`user : ${createdUser.email} created successfully`);
    return this.buildUserResponse(createdUser);
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const userByEmail = await this.userRepository.findOne({
      where: { email },
    });
    const isPasswordCorrect = await compare(password, userByEmail.password);
    if (!userByEmail || !isPasswordCorrect) {
      this.logger.error(`user : ${userByEmail.email} failed to loggin`);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    this.logger.log(`user : ${userByEmail.email} logged in successfully`);
    return this.buildUserResponse(userByEmail);
  }
  generateJwt(userEntity: UserEntity) {
    return sign(
      {
        id: userEntity.id,
        email: userEntity.email,
      },
      configService.get('JWT_SECRET'),
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
