import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountsService } from '../accounts/accounts.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SignInData } from './interfaces/auth.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SigninAuthDto } from './dto/signin-auth.dto';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly accountsService: AccountsService,
    ) {}

    @Post('signin')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'User Sign In', description: 'Authenticate user and return JWT token.' }) // Mô tả API
    @ApiBody({ type: SigninAuthDto }) // Định nghĩa body request
    @ApiResponse({ status: 201, description: 'SignIn successful'}) // Phản hồi khi thành công
    @ApiUnauthorizedResponse() // Phản hồi khi lỗi xác thực
    async signIn(@Request() req: { user: SignInData }) {
        //return this.authService.authenticate(signinAuthDto);
        return this.authService.signIn(req.user);
    }

    // @UseGuards(AuthGuard)
    // @ApiBearerAuth()
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
