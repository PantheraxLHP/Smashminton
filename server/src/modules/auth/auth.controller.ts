import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { AccountsService } from '../accounts/accounts.service';
import { AuthGuard } from './guards/auth.guards';
import { BADQUERY } from 'dns';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly accountsService: AccountsService,
    ) {}

    @Post('signin')
    login(@Body() signinAuthDto: SigninAuthDto) {
        return this.authService.authenticate(signinAuthDto);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('me')
    getUserInfo(@Request() req) {
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
