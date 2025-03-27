import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy],
    imports: [
        AccountsModule,
        PassportModule,
        JwtModule.register({
            secret: 'key',
            signOptions: { expiresIn: '1h' },
        }),
    ],
})
export class AuthModule {}
