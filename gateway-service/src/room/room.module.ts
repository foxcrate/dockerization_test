import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [RoomService],
  controllers: [RoomController],
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
})
export class RoomModule {}
