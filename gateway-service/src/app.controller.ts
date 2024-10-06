import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { io, Socket } from 'socket.io-client';

@Controller()
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('CHAT_SERVICE') private readonly chatServiceClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationServiceClient: ClientProxy,
  ) {}

  private socket: Socket;

  onModuleInit() {
    // Connect to the external WebSocket server
    this.socket = io('http://localhost:3000/chat'); // Replace with the actual WebSocket server URL

    this.socket.on('connect', () => {
      console.log('Connected to the WebSocket server');
    });

    this.socket.on('message2', (data) => {
      console.log('Received message from server:', data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from the WebSocket server');
    });
  }

  @Get('users')
  async getUsers() {
    console.log('I am gateway service , getUsers');
    return await this.userServiceClient.send({ cmd: 'get_users' }, {});
  }

  @Get('notifications')
  async getNotifications() {
    console.log('I am gateway service , getNotifications');
    return await this.notificationServiceClient.send(
      { cmd: 'get_notifications' },
      {},
    );
  }

  @Get('chats')
  async getChats() {
    console.log('I am gateway service , getChats');
    return await this.notificationServiceClient.send({ cmd: 'get_chats' }, {});
  }

  @Post('send-message')
  async sendMessage(@Body() message: { user: string; content: string }) {
    console.log('appController, send message()');

    // // Emit a message to the WebSocket server
    // this.socket.emit('message', message);

    return await this.chatServiceClient.send(
      { cmd: 'send_chat_message' },
      { message: 'good night' },
    );
  }
}
