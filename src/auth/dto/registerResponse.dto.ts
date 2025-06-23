import { UserResponseDto } from '../../users/dto/userResponse.dto';
import { IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterResponseDto {
  @IsString()
  message: string;

  @ValidateNested()
  @Type(() => UserResponseDto)
  @IsObject()
  user: UserResponseDto;
}
