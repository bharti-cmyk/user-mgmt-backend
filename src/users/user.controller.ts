import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Body,
  ParseIntPipe,
  Patch,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../roles/roles.decorator'
import { UserResponseDto } from './dto/userResponse.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ data: UserResponseDto[]; total: number; page: number; totalPages: number }> {
    return this.userService.findPaginatedUsers(+page, +limit, sortBy, sortOrder, search);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    })
  )
  async updateUserByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateProfileDto
  ): Promise<UserResponseDto> {
    const updateData: Partial<UpdateProfileDto & { avatar_url?: string }> = {
      username: body.username,
      bio: body.bio,
    };

    if (file) {
      updateData.avatar_url = `/uploads/${file.filename}`;
    }

    const updatedUser = await this.userService.update(id, updateData);
    return updatedUser as UserResponseDto;
  }


  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles('admin')

  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean }> {
    const success = await this.userService.delete(id);
    return { success };
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads', 
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    })
  )
  async updateProfile(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateProfileDto
  ): Promise<UserResponseDto> {
    const userId = req.user.sub;

    const updateData: Partial<UpdateProfileDto & { avatar_url?: string }> = {
      username: body.username,
      bio: body.bio,
    };

    if (file) {
      updateData.avatar_url = `/uploads/${file.filename}`; // or use S3 URL
    }

    const updatedUser = await this.userService.update(userId, updateData);
    return updatedUser as UserResponseDto;
  }
}
