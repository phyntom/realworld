import { UserEntity } from './../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@app/user/user.service';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import {} from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,

    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      next();
      throw new UnauthorizedException();
    }
    try {
      const payload = await (<Promise<UserEntity>>this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get('JWT_SECRET'),
        },
      ));
      const user = await this.userService.findUserById(payload.id);
      req['user'] = user;
      next();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Token' ? token : undefined;
  }
}
