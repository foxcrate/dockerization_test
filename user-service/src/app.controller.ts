import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_users' })
  async getUsers(@Payload() data: any, @Ctx() context: RedisContext) {
    // console.log(`Channel: ${context.getChannel()}`);
    // console.log('data in user microservice', data);
    console.log('I am user service');
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Ahmed Fawzy' },
    ];
  }
}

// getUsers() {
//   console.log('I am user service');
//   return [
//     { id: 1, name: 'John Doe' },
//     { id: 2, name: 'Jane Doe' },
//   ];
//   return;
// }
