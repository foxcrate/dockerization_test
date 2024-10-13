import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { MessageReturnDto } from './dtos/message-return.dto';
import { MessageCreateDto } from './dtos/message-create.dto';

@Injectable()
export class MessageService {
  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseServiceClient: ClientProxy,
  ) {}

  async findAllRoomMessages(
    room_id: number,
    page: number,
    limit: number,
  ): Promise<{
    messages: MessageReturnDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    console.log('chat micro, findAllRoomMessages');

    try {
      return await this.databaseServiceClient
        .send(
          { cmd: 'database_service.get_room_messages' },
          {
            room_id: room_id,
            page: page,
            limit: limit,
          },
        )
        .toPromise();
    } catch (error) {
      throw new RpcException({
        message: error.message,
        code: 400,
      });
    }
  }

  async saveNewMessage(
    new_message: MessageCreateDto,
  ): Promise<MessageReturnDto> {
    // console.log('new_message', new_message);
    try {
      return await this.databaseServiceClient
        .send({ cmd: 'database_service.save_new_message' }, new_message)
        .toPromise();
    } catch (error) {
      throw new RpcException({
        message: error.message,
        code: 400,
      });
    }
  }
}
