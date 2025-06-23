import {
    Controller,
    Post,
    Body,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Get,
    Query,
    ParseIntPipe,
    UseGuards,
    Request,
    Patch
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from './guards/auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token-guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @UseInterceptors(
        FileInterceptor('profileImage', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    async register(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
        const user = await this.authService.register(body, file);
        await this.authService.sendVerificationLink(user);
        return { message: 'User registered successfully. OTP sent.', user };
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        return { message: 'Login successful', user };
    }

    @Post('forgot-password')
    async forgotPassword(@Body() body: { email: string }) {
        const token = await this.authService.resetPasswordRequest(body.email);
        if (!token) throw new BadRequestException('User not found');

        return { message: 'Reset token generated and sent', token };
    }

    @UseGuards(AuthGuard)
    @Get('me')
    async getProfile(@Request() req) {
        return this.authService.getUserByEmail(req.user.email);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        if (!token) {
            throw new BadRequestException('Verification token is missing');
        }

        const result = await this.authService.verifyEmail(token);

        return { message: result };
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh-token')
    async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
        const result = await this.authService.refreshAccessToken(refreshToken);
        return result;
    }


    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Body() body: { userId: number }) {
        const result = await this.authService.logout(body.userId);
        return { message: result };
    }

    @Post('reset-password')
    async resetPassword(
        @Body() body: { token: string; newPassword: string }
    ) {
        return this.authService.resetPassword(body.token, body.newPassword);
    }

}
