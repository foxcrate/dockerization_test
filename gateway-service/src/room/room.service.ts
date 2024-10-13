import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RoomCreateDto } from './dtos/room-create.dto';

@Injectable()
export class RoomService {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatServiceClient: ClientProxy,
  ) {}

  async getRoomById(id: number) {
    try {
      return await this.chatServiceClient
        .send({ cmd: 'chat_service.get_room_info' }, { id })
        .toPromise();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllRooms() {
    return await this.chatServiceClient
      .send({ cmd: 'chat_service.get_all_rooms' }, {})
      .toPromise();
  }

  async getRoomMessages(roomId: number, page: number, limit: number) {
    try {
      return await this.chatServiceClient
        .send(
          { cmd: 'chat_service.find_all_room_messages' },
          { roomId, page, limit },
        )
        .toPromise();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createRoom(room: RoomCreateDto) {
    try {
      return await this.chatServiceClient
        .send({ cmd: 'chat_service.save_new_room' }, { room })
        .toPromise();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
