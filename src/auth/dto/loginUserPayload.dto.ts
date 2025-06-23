import { IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/userResponse.dto';

export class LoginUserPayloadDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsNumber()
  expiresIn: number;

  @ValidateNested()
  @Type(() => UserResponseDto)
  @IsObject()
  user: UserResponseDto;
}
