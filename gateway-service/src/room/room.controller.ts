import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { RoomCreateDto } from './dtos/room-create.dto';
import { RoomMessagesDto } from './dtos/room-messages.dto';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getRooms() {
    // console.log('gateway/room controller');

    return await this.roomService.getAllRooms();
  }

  @UseGuards(AuthGuard)
  @Get('messages')
  async getRoomMessages(@Query() params: RoomMessagesDto) {
    // console.log('gateway/room controller');

    return await this.roomService.getRoomMessages(
      params.roomId,
      params.page ? params.page : null,
      params.limit ? params.limit : null,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  async createRoom(@Body() newRoom: RoomCreateDto) {
    // console.log('gateway controller');
    return await this.roomService.createRoom(newRoom);
  }
}
