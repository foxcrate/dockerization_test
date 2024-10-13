import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { MessageService } from './message.service';
import { MessageCreateDto } from './dtos/message-create.dto';

@Controller('user')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern({ cmd: 'chat_service.find_all_room_messages' })
  async findAllRoomMessages(
    @Payload() data: { roomId: number; page: number; limit: number },
    @Ctx() context: RedisContext,
  ) {
    console.log('chat-message controller');

    // return true;
    return await this.messageService.findAllRoomMessages(
      data.roomId,
      data.page,
      data.limit,
    );
  }

  @MessagePattern({ cmd: 'chat_service.save_new_message' })
  async saveNewMessage(
    @Payload() data: { message: MessageCreateDto },
    @Ctx() context: RedisContext,
  ) {
    console.log('chat-message controller');

    // return true;
    return await this.messageService.saveNewMessage(data.message);
  }
}
