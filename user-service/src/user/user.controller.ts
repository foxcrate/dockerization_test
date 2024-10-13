import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { UserService } from './user.service';
import { UserSignUpDto } from './dtos/user-signup.dto';
import { UserSignInDto } from './dtos/user-signin.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'user_service.get_users' })
  async getUsers(@Payload() data: any, @Ctx() context: RedisContext) {
    console.log('user controller');

    // return true;
    return await this.userService.getUsers();
  }

  @MessagePattern({ cmd: 'user_service.signup_user' })
  async signupUser(
    @Payload() data: { signup_user: UserSignUpDto },
    @Ctx() context: RedisContext,
  ) {
    console.log('user controller');

    // return true;
    return await this.userService.signupUser(data.signup_user);
  }

  @MessagePattern({ cmd: 'user_service.signin_user' })
  async signinUser(
    @Payload() data: { signin_user: UserSignInDto },
    @Ctx() context: RedisContext,
  ) {
    console.log('user controller');

    // return true;
    return await this.userService.signinUser(data.signin_user);
  }

  @MessagePattern({ cmd: 'user_service.get_user_by_id' })
  async getUserById(
    @Payload() data: { id: number },
    @Ctx() context: RedisContext,
  ) {
    console.log('user controller');

    // return true;
    return await this.userService.getUserById(data.id);
  }
}
