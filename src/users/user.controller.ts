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
import { User } from './user.model';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from '../roles/roles.decorator'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string
  ): Promise<any> {
    return this.userService.findPaginatedUsers(+page, +limit, search);
  }

  @Put(':id')
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
    @Body() body: any
  ) {
    const updateData: any = {
      username: body.username,
      email: body.email,
    };

    if (file) {
      updateData.avatar_url = `/uploads/${file.filename}`;
    }

    return this.userService.update(id, updateData);
  }


  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean }> {
    const success = await this.userService.delete(id);
    return { success };
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads', // 🔁 Change as needed
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
    @Body() body: any
  ) {
    const userId = req.user.sub;

    const updateData: any = {
      username: body.username,
      bio: body.bio,
    };

    if (file) {
      updateData.avatar_url = `/uploads/${file.filename}`; // or use S3 URL
    }

    return this.userService.update(userId, updateData);
  }
}
