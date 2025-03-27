import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { AccountsService } from '../accounts/accounts.service';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { SignInData } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly accountsService: AccountsService,
    ) {}

    @Post('signin')
    @UseGuards(PassportLocalGuard)
    login(@Request() req: { user: SignInData }) {
        //return this.authService.authenticate(signinAuthDto);
        return this.authService.generateToken(req.user);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('me')
    getUserInfo(@Request() req: { user: SignInData }) {
        return req.user;
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.authService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.authService.remove(+id);
    }
}
