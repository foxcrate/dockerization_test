import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { UserSignUpDto } from './dtos/user-signup.dto';
import { UserSignInDto } from './dtos/user-signin.dto';
import { UserReturnDto } from './dtos/user-return.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseServiceClient: ClientProxy,
  ) {}
  async getUsers() {
    console.log('user service');
    // return true;

    return await this.databaseServiceClient.send(
      { cmd: 'database_service.get_users' },
      {},
    );
  }

  async signupUser(signup_user: UserSignUpDto) {
    console.log('user service signup user');

    signup_user.password = await this.hashPassword(signup_user.password);

    let sameEmailUser = await this.databaseServiceClient
      .send(
        { cmd: 'database_service.get_user_by_email' },
        { email: signup_user.email },
      )
      .toPromise();

    if (sameEmailUser) {
      throw new RpcException({
        message: 'User already exists',
        status: 400,
      });
    }

    return await this.databaseServiceClient.send(
      { cmd: 'database_service.save_new_user' },
      { signup_user },
    );
  }

  async signinUser(signin_user: UserSignInDto) {
    console.log('user service signin user');

    let savedUser = await this.databaseServiceClient
      .send(
        { cmd: 'database_service.get_user_by_email' },
        { email: signin_user.email },
      )
      .toPromise();

    if (!savedUser) {
      throw new RpcException({
        status: 401,
        message: 'Email or password is incorrect',
      });
    }

    let matchPassword = await this.verifyPassword(
      signin_user.password,
      savedUser.password,
    );

    if (!matchPassword) {
      throw new RpcException({
        status: 401,
        message: 'Email or password is incorrect',
      });
    }

    delete savedUser.password;

    // console.log('savedUser', savedUser);

    return savedUser;
  }

  async getUserByEmail(email: string) {
    let savedUser = await this.databaseServiceClient
      .send({ cmd: 'database_service.get_user_by_email' }, { email: email })
      .toPromise();

    if (!savedUser) {
      throw new RpcException({
        status: 401,
        message: 'Email or password is incorrect',
      });
    }

    return savedUser;
  }

  async getUserById(id: number): Promise<UserReturnDto> {
    let savedUser = await this.databaseServiceClient
      .send({ cmd: 'database_service.get_user_by_id' }, { id: id })
      .toPromise();

    if (!savedUser) {
      throw new RpcException({
        status: 401,
        message: `User don't exist`,
      });
    }

    return savedUser;
  }

  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async verifyPassword(password, hash): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
}
