import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Socket } from 'socket.io';
import { MessageCreateDto } from './dtos/message-create.dto';
import { UserReturnDto } from 'src/user/dtos/user-return.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SocketService {
  constructor(
    @Inject('CHAT_SERVICE')
    private readonly chatServiceClient: ClientProxy,
    private userService: UserService,
  ) {}
  private clients: Map<number, Socket> = new Map();

  addClient(socket: Socket, userId: number) {
    this.clients.set(userId, socket);
  }

  removeClient(userId: number) {
    this.clients.delete(userId);
  }

  disconnectClient(userId: number) {
    const clientSocket = this.clients.get(userId);
    if (clientSocket) {
      clientSocket.disconnect();
      this.removeClient(userId);
    }
  }

  getClients() {
    return Array.from(this.clients.keys());
  }

  async handleMessage(newMessage: MessageCreateDto) {
    // console.log('newMessage in socket', newMessage);

    try {
      await this.chatServiceClient
        .send({ cmd: 'chat_service.save_new_message' }, { message: newMessage })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  async getRoomInfo(
    socket: Socket,
    roomId: number,
  ): Promise<{ id: number; name: string }> {
    // console.log('newMessage in socket', newMessage);

    try {
      let theRoom = await this.chatServiceClient
        .send({ cmd: 'chat_service.get_room_info' }, { roomId: roomId })
        .toPromise();
      //   console.log('theRoom', theRoom);

      return theRoom;
    } catch (error) {
      console.log(error);
      socket.emit('error', 'Room not found');
    }
  }

  async getUserInfo(socket: Socket, userId: number): Promise<UserReturnDto> {
    // console.log('newMessage in socket', newMessage);

    try {
      let theUser = await this.userService.getUserById(userId);
      return theUser;
    } catch (error) {
      console.log(error);
      socket.emit('error', 'User not found');
    }
  }

  async validateToken(token: string, socket: Socket) {
    try {
      let payload = await this.userService.verifyToken(token);
      let theUser = await this.userService.getUserById(payload.userId);

      if (!theUser) {
        socket.emit('error', 'Wrong credentials');
        // console.log('Missing authentication token');
        socket.disconnect();
      }

      return theUser;
    } catch (error) {
      socket.emit('error', 'Wrong credentials');
      // console.log('Missing authentication token');
      socket.disconnect();
      //   throw new UnauthorizedException('Wrong credentials');
    }
  }
}
