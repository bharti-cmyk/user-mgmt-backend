import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { Otp } from './otp.model';
import { PasswordReset } from './password_reset.model';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Op } from 'sequelize';
import { MailerService } from './mailer.service';
import { EmailVerification } from './email_verification.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
    constructor(
        private mailerService: MailerService,
        private jwtService: JwtService,
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
        @InjectModel(User) private userModel: typeof User,
        @InjectModel(EmailVerification) private emailVerificationModel: typeof EmailVerification,
        @InjectModel(PasswordReset) private resetModel: typeof PasswordReset,
        private configService: ConfigService,
    ) { }

    async register(data: any, file?: Express.Multer.File) {
        const hashedPassword = await bcrypt.hash(data.password.trim(), 10);
        const user = await this.userModel.create({
            username: data.username,
            email: data.email,
            password: hashedPassword,
            avatar_url: file?.path || null,
            bio: data.bio || '',
            role: data.role || 'user',
        } as any);

        return user;
    }

    async validateUser(email: string, password: string) {
        const user = await this.userModel.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.is_verified) {
            throw new UnauthorizedException('Please verify your email before logging in');
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            throw new BadRequestException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });

        await this.redisClient.set(refreshToken, user.id, 'EX', 7 * 24 * 60 * 60);

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: '1h',
        });

        return {
            accessToken,
            refreshToken,
            expiresIn: 3600,
            user,
        };
    }


    async resetPasswordRequest(email: string) {
        const user = await this.userModel.findOne({ where: { email } });
        if (!user) return null;

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 min

        await this.resetModel.create({
            user_id: user.id,
            token,
            expires_at: expires,
        } as any);

        const resetUrl = `http://localhost:3001/reset-password?token=${token}`;

        await this.mailerService.sendMail(
            user.email,
            'Password Reset Request',
            `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 30 minutes.</p>`
        );

        return token; 
    }


    async getUserByEmail(email: string) {
        return this.userModel.findOne({ where: { email } });
    }

    async sendVerificationLink(user: User) {
        const token = crypto.randomUUID();

        await this.emailVerificationModel.create({
            user_id: user.id,
            token,
            expires_at: new Date(Date.now() + 10 * 60 * 1000),
        } as any);

        const verifyUrl = `http://localhost:3001/verify-email?token=${token}`;

        await this.mailerService.sendMail(
            user.email,
            'Verify Your Email',
            `<p>Click <a href="${verifyUrl}">here</a> to verify your email address</p>`
        );
    }

    async verifyEmail(token: string): Promise<string> {
        const record = await this.emailVerificationModel.findOne({
            where: {
                token,
                expires_at: { [Op.gt]: new Date() },
                is_used: false,
            },
        });

        if (!record) {
            throw new BadRequestException('Invalid or expired token');
        }

        await this.userModel.update({ is_verified: true }, { where: { id: record.user_id } });
        await this.emailVerificationModel.update({ is_used: true }, { where: { id: record.id } });

        return 'Email successfully verified';
    }

    // async getRefreshToken(userId: number, refreshToken: string): Promise<{ accessToken: string }> {
    //     const storedToken = await this.redisClient.get(`refresh:${userId}`);
    //     if (!storedToken) throw new UnauthorizedException('No refresh token stored');

    //     if (storedToken !== refreshToken) {
    //         throw new UnauthorizedException('Invalid refresh token');
    //     }

    //     const decoded = await this.jwtService.verifyAsync(refreshToken, {
    //         secret: this.configService.get('JWT_REFRESH_SECRET'),
    //     });

    //     const payload = { sub: decoded.sub, email: decoded.email, role: decoded.role };
    //     const newAccessToken = this.jwtService.sign(payload, {
    //         secret: this.configService.get('JWT_SECRET'),
    //         expiresIn: '1h',
    //     });
    //     return { accessToken: newAccessToken };
    // }

    async logout(userId: number): Promise<string> {
        await this.redisClient.del(`refresh:${userId}`);
        return 'Logged out successfully';
    }

    async refreshAccessToken(refreshToken: string) {
        let payload = this.jwtService.verify(refreshToken, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
        const savedToken = await this.redisClient.get(`refresh:${payload.sub}`);
        if (savedToken !== refreshToken) {
            throw new UnauthorizedException('Token does not match server store');
        }

        const newAccessToken = this.jwtService.sign(
            { sub: payload.sub, email: payload.email, role: payload.role },
            { secret: this.configService.get('JWT_SECRET'), expiresIn: '1h' }
        );

        return { accessToken: newAccessToken };
    }

    async resetPassword(token: string, newPassword: string) {
        const record = await this.resetModel.findOne({
            where: {
                token,
                expires_at: { [Op.gt]: new Date() }
            }
        });

        if (!record) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await this.userModel.update({ password: hashed }, { where: { id: record.user_id } });

        await record.destroy(); // delete used token

        return { message: 'Password has been reset successfully' };
    }

    async updateProfile(userId, body){
        
    }

}
