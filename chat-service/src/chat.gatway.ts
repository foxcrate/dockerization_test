import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  pubClient;
  subClient;

  async onModuleInit() {
    this.pubClient = createClient({ url: 'redis://localhost:6379' });
    this.subClient = this.pubClient.duplicate();

    console.log('module init');

    let x = await Promise.all([
      this.pubClient.connect(),
      this.subClient.connect(),
    ]);
    // pubClient.set('chat', 'Hello from the other side!');

    // console.log(x);

    // console.log('pubClient.isReady:', pubClient.isReady);

    // this.server.adapter(createAdapter(pubClient, subClient));

    this.server = new Server({
      adapter: createAdapter(this.pubClient, this.subClient),
    });
  }

  afterInit(server: Server) {
    console.log('Chat Socket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.pubClient.set('clientId', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendMessageToNotification(data: string) {
    // Emit event to notify other services (e.g., Notification service)
    this.server.emit('messageFromChat', data);
  }

  @SubscribeMessage('chat_message')
  handleMessage(client: Socket, payload: any): void {
    console.log('Received message:', payload);
    this.pubClient.publish('chat_message', payload);
    // this.server.emit('notification_message', payload); // Broadcast the message to all connected clients
  }

  @SubscribeMessage('notificationFromService')
  handleNotification(client: Socket, data: string) {
    console.log('Received notification:', data);
  }

  @SubscribeMessage('message')
  async handleMessage2(client: Socket, data: string) {
    console.log('Received message:', data);
    let clientId = await this.pubClient.get('clientId');
    // this.server.serveClient
    this.server.to(clientId).emit('message', data);
  }
}
