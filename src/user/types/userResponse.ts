import { UserEntity } from '@app/user/user.entity';

export interface UserResponseInterface {
  user: Omit<UserEntity, 'hashPasswd'> & { token: string };
}
