import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('socket auth guard');

    const client = context.switchToWs().getClient();
    const token = client.handshake?.auth?.token;

    if (!token) {
      throw new WsException('Missing authentication token');
    }

    try {
      const payload = this.jwtService.verify(token);
      client.user = payload;
      return true;
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }
}
