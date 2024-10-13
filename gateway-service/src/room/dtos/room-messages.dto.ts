import { IsNotEmpty, IsOptional } from 'class-validator';

export class RoomMessagesDto {
  @IsNotEmpty()
  roomId: number;

  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;
}
