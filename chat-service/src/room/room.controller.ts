import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { RoomService } from './room.service';
import { RoomCreateDto } from './dtos/room-create.dto';

@Controller('user')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @MessagePattern({ cmd: 'chat_service.get_room_info' })
  async getRoomInfo(
    @Payload() data: { roomId: number },
    @Ctx() context: RedisContext,
  ) {
    console.log('chat-room controller');

    // return true;
    return await this.roomService.getRoomInfo(data.roomId);
  }

  @MessagePattern({ cmd: 'chat_service.save_new_room' })
  async saveNewRoom(
    @Payload() data: { room: RoomCreateDto },
    @Ctx() context: RedisContext,
  ) {
    console.log('chat-room controller');

    // console.log('data', data);

    return await this.roomService.createRoom(data.room);
  }

  @MessagePattern({ cmd: 'chat_service.get_all_rooms' })
  async getAllRooms(@Payload() data, @Ctx() context: RedisContext) {
    console.log('chat-room controller');

    // return true;
    return await this.roomService.getAll();
  }
}
