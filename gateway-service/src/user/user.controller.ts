import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserSignUpDto } from './dtos/user-signup.dto';
import { UserSignInDto } from './dtos/user-signin.dto';
import { UserService } from './user.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUsers() {
    // console.log('gateway controller');

    return await this.userService.getUsers();
  }

  @Post('signup')
  async signup(@Body() signup_user: UserSignUpDto) {
    // console.log('gateway controller');

    return await this.userService.signup(signup_user);
  }

  @Post('signin')
  async signin(@Body() signin_user: UserSignInDto) {
    // console.log('gateway controller');

    return this.userService.signin(signin_user);
  }
}
