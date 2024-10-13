import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [MessageModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
