import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_notifications' })
  async getNotifications() {
    console.log('I am notification service');
    return [
      { id: 1, content: 'Notification 1' },
      { id: 2, content: 'Notification 2' },
    ];
  }
}
