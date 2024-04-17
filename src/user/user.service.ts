import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { LoginUserDto } from '@app/user/dto/login-user.dto';
import { UserResponseInterface } from './types/userResponse';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  /**
   * method to create a new user
   * @param createUserDto
   * @returns
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
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
    // remove passord from the response
    delete createdUser.password;
    return createdUser;
  }

  /**
   * method to login a user
   * @param loginUserDto
   * @returns
   */
  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
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
    // remove passord from the response
    delete userByEmail.password;
    return userByEmail;
  }

  async findUserById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  /**
   * method to generate jwt token
   * @param userEntity
   * @returns
   */
  generateJwt(userEntity: UserEntity) {
    const payload = {
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
      bi: userEntity.bio,
      image: userEntity.image,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
    return token;
  }

  /**
   * method to build user response
   * @param userEntity
   * @returns
   */
  buildUserResponse(userEntity: UserEntity): UserResponseInterface {
    return {
      user: {
        ...userEntity,
        token: this.generateJwt(userEntity),
      },
    };
  }
}
