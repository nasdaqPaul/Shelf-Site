import { IsAlphanumeric, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  username: string;
  @IsAlphanumeric()
  password;
}
