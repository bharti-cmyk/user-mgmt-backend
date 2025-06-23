import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/models/user.model';
import { PasswordReset } from './models/password_reset.model';
import { EmailVerification } from './models/email_verification.model';
import { MailerService } from './mailer.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisProvider } from 'src/redis/redis.provider';

@Module({
  imports: [PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }
      }),
      inject: [ConfigService]
    }),
    SequelizeModule.forFeature([User, EmailVerification, PasswordReset])],
  controllers: [AuthController],
  providers: [AuthService, MailerService, RedisProvider],
  exports: [],
})
export class AuthModule { }
