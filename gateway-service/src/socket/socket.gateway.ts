import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { SocketService } from './socket.service';
import { UseGuards } from '@nestjs/common';
import { SocketAuthGuard } from './socket-auth.guard';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/socket' })
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  constructor(private socketService: SocketService) {}
  private clients: Map<string, Socket> = new Map();

  async onModuleInit() {}

  afterInit(server: Server) {
    console.log('Socket server initialized');
  }

  async handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);

    const token: any = socket.handshake?.headers?.bearer_token;

    // console.log('token', token);

    if (!token) {
      socket.emit('error', 'Missing authentication token');
      // console.log('Missing authentication token');
      socket.disconnect();
    }

    let theUser = await this.socketService.validateToken(token, socket);

    if (theUser) {
      socket.data = { userId: theUser.id };

      this.socketService.addClient(socket, theUser.id);
    }
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
    this.socketService.removeClient(socket.data.userId); // Remove client from the service
  }

  // @UseGuards(SocketAuthGuard)
  @SubscribeMessage('serverRoomMessage')
  async handleNewMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    payload: any,
  ): Promise<void> {
    try {
      payload = JSON.parse(payload);
      console.log('payload', payload);
    } catch (error) {
      socket.emit('error', 'json error');
      throw new WsException('json error');
    }

    // validate payload

    if (!payload.content || !payload.roomId) {
      socket.emit('error', 'missing payload');
      throw new WsException('missing payload');
    }

    this.socketService.handleMessage({
      content: payload.content,
      userId: socket.data.userId,
      roomId: payload.roomId,
    });
    let theRoom = await this.socketService.getRoomInfo(socket, payload.roomId);
    let theUser = await this.socketService.getUserInfo(
      socket,
      socket.data.userId,
    );
    // this.server.to(theRoom.name).emit('new_room_message', payload);

    socket.broadcast.to(theRoom.name).emit('new_room_message', {
      content: payload.content,
      userId: theUser.id,
      userName: theUser.name,
    });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    body = JSON.parse(body);
    let theRoom = await this.socketService.getRoomInfo(client, body.roomId);
    console.log('client.data.userId:', client.data.userId);

    let theUser = await this.socketService.getUserInfo(
      client,
      client.data.userId,
    );

    client.join(theRoom.name); // Add client to the specified room

    // this.server.to(theRoom.name).except(client.id).emit('new_user_joined', {
    //   userId: theUser.id,
    //   userName: theUser.name,
    // });

    client.broadcast.to(theRoom.name).emit('new_user_joined', {
      userId: theUser.id,
      userName: theUser.name,
    });

    // client.emit('new_user_joined', {
    //   userId: theUser.id,
    //   userName: theUser.name,
    // });

    // console.log(`Client ${client.id} joined room ${room}`);
    // client.emit('message', `Welcome to room: ${room}`);
    // console.log('client.rooms:', client.rooms);
  }

  @SubscribeMessage('userTyping')
  async handleUserTyping(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    body = JSON.parse(body);

    if (!body.roomId) {
      client.emit('error', `missing payload`);
      throw new WsException('missing payload');
    }
    let theRoom = await this.socketService.getRoomInfo(client, body.roomId);
    // console.log('client.data.userId:', client.data.userId);

    let theUser = await this.socketService.getUserInfo(
      client,
      client.data.userId,
    );

    // client.join(theRoom.name);

    client.broadcast.to(theRoom.name).emit('user_typing', {
      userId: theUser.id,
      userName: theUser.name,
    });
  }
}
