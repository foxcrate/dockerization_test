import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { io, Socket } from 'socket.io-client';
import { createClient } from 'redis';
import { ChatGateway } from './chat.gatway';

@Controller()
export class AppController {
  pubClient: ReturnType<typeof createClient>;
  subClient: ReturnType<typeof createClient>;
  constructor(
    private readonly appService: AppService,
    private chatGateway: ChatGateway,
  ) {}
  private socket: Socket;
  async onModuleInit() {
    // this.socket = io('http://localhost:3001/chat');
    // this.socket.on('connect', () => {
    //   console.log('Connected to the WebSocket server');
    // });
    // this.socket.on('message2', (data) => {
    //   console.log('Received message from server in chat microservice:', data);
    // });
    // this.socket.on('disconnect', () => {
    //   console.log('Disconnected from the WebSocket server');
    // });
    this.pubClient = createClient({ url: 'redis://localhost:6379' });
    this.subClient = this.pubClient.duplicate();

    await this.pubClient.connect();
    await this.subClient.connect();
  }

  @MessagePattern({ cmd: 'get_chats' })
  getChats() {
    console.log('I am chat microservice service 1');
    return [
      { id: 1, message: 'one' },
      { id: 2, message: 'two' },
    ];
  }

  @MessagePattern({ cmd: 'send_chat_message' })
  sendMessage2(@Payload() data: any, @Ctx() context: RedisContext) {
    console.log('I am chat microservice 1 controller');
    console.log(data);
    console.log('I am chat microservice 1 controller');

    console.log('chat micro service: appController');

    // Emit a message to the WebSocket server
    this.socket.emit('message', data.message);
    return true;
  }

  @Post('broadcast')
  async broadcastMessage(@Body() payload: { message: string }) {
    const socket = io('http://localhost:3001/chat');

    socket.emit('message', payload);

    return { success: true, message: 'Message broadcasted successfully' };
  }

  @Get('send')
  sendMessage() {
    // Somewhere in your Chat service
    this.chatGateway.sendMessageToNotification('A new chat message!');
  }
}
