import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RoomReturnDto } from './dtos/room-return.dto';
import { RoomCreateDto } from './dtos/room-create.dto';

@Injectable()
export class RoomService {
  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseServiceClient: ClientProxy,
  ) {}

  async getRoomInfo(room_id: number): Promise<{
    room: RoomReturnDto;
  }> {
    let theRoom = await this.databaseServiceClient
      .send(
        { cmd: 'database_service.get_room_info' },
        {
          room_id: room_id,
        },
      )
      .toPromise();

    if (!theRoom) {
      throw new RpcException({
        status: 401,
        message: 'Room not found',
      });
    }

    return theRoom;
  }

  async createRoom(room: RoomCreateDto): Promise<RoomReturnDto> {
    // console.log('room', room);

    try {
      return await this.databaseServiceClient
        .send({ cmd: 'database_service.save_new_room' }, room)
        .toPromise();
    } catch (error) {
      throw new RpcException({
        message: error,
        code: 400,
      });
    }
  }

  async getAll(): Promise<RoomReturnDto[]> {
    // console.log('room', room);
    return await this.databaseServiceClient
      .send({ cmd: 'database_service.get_all_rooms' }, {})
      .toPromise();
  }
}
