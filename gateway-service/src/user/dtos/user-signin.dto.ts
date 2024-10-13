import { IsString } from 'class-validator';

export class UserSignInDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
