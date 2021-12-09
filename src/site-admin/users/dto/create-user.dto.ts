import { IsAlphanumeric, IsEmail, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UserRole } from '../schemas/user.schema';
import { Type } from 'class-transformer';

class UserProfileDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
}
export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  username: string;
  @IsAlphanumeric()
  password;
  @IsEnum(UserRole)
  role: UserRole
  @IsOptional()
  @ValidateNested()
  @Type(() => UserProfileDto)
  profile: UserProfileDto;
}
