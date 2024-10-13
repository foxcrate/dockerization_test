import { UserReturnDto } from './user-return.dto';

export class MessageReturnDto {
  id: number;

  roomId?: string;

  // userId?: string;
  user?: UserReturnDto;

  content: string;

  createdAt: Date;

  updatedAt: Date;
}
