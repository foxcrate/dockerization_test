import { IsString } from 'class-validator';

export class RoomCreateDto {
  @IsString()
  name: string;
}
