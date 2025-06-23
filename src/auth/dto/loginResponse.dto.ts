import { IsString, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { LoginUserPayloadDto } from './loginUserPayload.dto';

export class LoginResponseDto {
  @IsString()
  message: string;

  @ValidateNested()
  @Type(() => LoginUserPayloadDto)
  @IsObject()
  user: LoginUserPayloadDto;
}
