import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserSignUpDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  age: string;
}
