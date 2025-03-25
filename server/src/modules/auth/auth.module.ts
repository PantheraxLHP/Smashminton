import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [AccountsModule],
})
export class AuthModule {}
