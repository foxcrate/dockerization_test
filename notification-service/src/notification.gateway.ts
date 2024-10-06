import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { createAdapter, createShardedAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

@WebSocketGateway({ namespace: '/chat' })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;
  pubClient;
  subClient;

  async onModuleInit() {
    this.pubClient = createClient({ url: 'redis://localhost:6379' });
    this.subClient = this.pubClient.duplicate();

    // console.log(pubClient, subClient);
    console.log('module init');
    // console.log('server:', this.server);

    await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
    // let chatKey = await pubClient.get('chat');

    this.subClient.subscribe('chat_message', (message) => {
      console.log('new chat message:', message);
    });
    // console.log('chatKey:', chatKey);

    // this.server.adapter(createAdapter(pubClient, subClient));

    this.server = new Server({
      adapter: createAdapter(this.pubClient, this.subClient),
    });

    // this.server.adapter = await createShardedAdapter(
    //   this.pubClient,
    //   this.subClient,
    // );
    // console.log(this.server);
  }

  afterInit(server: Server) {
    console.log('NotificationSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('notification_message')
  async handleMessage(client: Socket, payload: any) {
    console.log('Received message:', payload);
    let clientId = await this.pubClient.get('clientId');
    console.log('clientId:', clientId);

    this.server.to(clientId).emit('message', payload);
  }

  @SubscribeMessage('messageFromChat')
  handleChatMessage(client: Socket, data: string) {
    console.log('Received message from Chat service:', data);

    // You can handle the notification logic here
    // this.server.emit('notifyUser', `Notification: ${data}`);
  }
}
