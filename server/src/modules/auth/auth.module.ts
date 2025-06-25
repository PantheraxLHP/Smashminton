import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/role.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { NodemailerService } from '../nodemailer/nodemailer.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        NodemailerService,
        PrismaService,
        // {
        //     provide: APP_GUARD,
        //     useClass: JwtAuthGuard, // Đăng ký JwtAuthGuard trước
        // },
        // {
        //     provide: APP_GUARD,
        //     useClass: RolesGuard, // Đăng ký RolesGuard sau
        // },
    ],
    imports: [
        AccountsModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES') },
            }),
            inject: [ConfigService],
        }),
    ],
})
export class AuthModule {}
    