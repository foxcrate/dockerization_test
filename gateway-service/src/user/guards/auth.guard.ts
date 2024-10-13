import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log('auth guard');

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    let payload: any = await this.userService.verifyToken(token);
    if (!payload.userId || payload.userId === null) {
      throw new UnauthorizedException('Wrong credentials');
    }

    try {
      //   console.log('payload.userId:', payload.userId);

      let theUser = await this.userService.getUserById(payload.userId);

      if (!theUser) {
        throw new UnauthorizedException('Wrong credentials');
      }

      //   console.log('theUser', theUser);

      request['id'] = payload.userId;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Wrong credentials');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
