import { IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

export class RefreshTOkenResponse {
    @IsString()
    accessToken: string
}