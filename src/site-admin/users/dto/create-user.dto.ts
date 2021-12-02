import { IsAlphanumeric, IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  username: string;
  @IsAlphanumeric()
  password;
  @IsEnum(UserRole)
  role: UserRole
}
