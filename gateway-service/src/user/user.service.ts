import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { UserReturnDto } from './dtos/user-return.dto';
import { UserSignUpDto } from './dtos/user-signup.dto';
import { UserSignInDto } from './dtos/user-signin.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateAuthJWTToken(userId: number) {
    let tokenPayload = {
      userId: userId,
    };

    return this.jwtService.sign(tokenPayload, {
      expiresIn: '7d',
    });
  }

  async getUsers(): Promise<UserReturnDto[]> {
    try {
      //   console.log('getUserById');

      let theUsers = await this.userServiceClient
        .send({ cmd: 'user_service.get_users' }, {})
        .toPromise();

      return theUsers;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signup(signup_user: UserSignUpDto): Promise<UserReturnDto> {
    try {
      return await this.userServiceClient
        .send({ cmd: 'user_service.signup_user' }, { signup_user })
        .toPromise();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signin(
    signin_user: UserSignInDto,
  ): Promise<{ user: UserReturnDto; token: any }> {
    try {
      let theUser = await this.userServiceClient
        .send({ cmd: 'user_service.signin_user' }, { signin_user })
        .toPromise();
      // console.log('theUser:', theUser);

      return {
        user: theUser,
        token: await this.generateAuthJWTToken(theUser.id),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserById(id: number): Promise<UserReturnDto> {
    try {
      console.log('getUserById');

      let theUser = await this.userServiceClient
        .send({ cmd: 'user_service.get_user_by_id' }, { id })
        .toPromise();
      //   console.log('theUser:', theUser);

      return theUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyToken(token): Promise<any> {
    // console.log('verifyToken');

    try {
      const decoded = this.jwtService.verify(
        token,
        this.configService.get('JWT_SECRET'),
      );
      //   console.log('decoded:', decoded);

      return decoded;
    } catch (error) {
      // console.log('error in auth guard:', error);
      throw new UnauthorizedException({
        status: 401,
        message: 'Wrong JWT token',
      });
    }
  }
}
