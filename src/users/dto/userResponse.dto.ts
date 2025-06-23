
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @IsNumber()
  @Expose()
  id: number;

  @IsString()
  @Expose()
  username: string;

  @IsEmail()
  @Expose()
  email: string;

  @IsOptional()
  @IsString()
  @Expose()
  avatar_url: string | null;

  @IsOptional()
  @IsString()
  @Expose()
  bio: string;

  @IsBoolean()
  @Expose()
  is_verified: boolean;

  @IsEnum(['user', 'admin'])
  @Expose()
  role: 'user' | 'admin';

  @IsOptional()
  @IsDate()
  @Expose()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  @Expose()
  updatedAt: Date;

  @Exclude()
  password?: string;
}
