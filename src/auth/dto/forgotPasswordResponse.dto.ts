import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordResponseDto {
  @IsString()
  message: string;

  @IsString()
  token: string;
}
