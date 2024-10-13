import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SocketAuthGuard } from './socket-auth.guard';
import { UserModule } from 'src/user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    UserModule,
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.REDIS,
        options: {
          port: 6379,
          host: 'localhost',
        },
      },
    ]),
  ],
  providers: [SocketService, SocketGateway, SocketAuthGuard],
})
export class SocketModule {}
