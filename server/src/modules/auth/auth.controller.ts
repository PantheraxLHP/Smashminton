import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Res,
    BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AccountsService } from '../accounts/accounts.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCookieAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInData } from './interfaces/auth.interface';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { Public } from 'src/decorators/public.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly accountsService: AccountsService,
    ) {}

    @Post('signin')
    @UseGuards(LocalAuthGuard)// Đánh dấu route này là công khai
    @Public()
    @ApiOperation({ summary: 'User Sign In', description: 'Authenticate user and return JWT token.' }) // Mô tả API
    @ApiBody({ type: SigninAuthDto }) // Định nghĩa body request
    @ApiResponse({ status: 201, description: 'SignIn successful' }) // Phản hồi khi thành công
    @ApiUnauthorizedResponse() // Phản hồi khi lỗi xác thực
    async signIn(@Request() req: { user: SignInData }, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.authService.signIn(req.user);
        // Đặt refresh token vào cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Chỉ truy cập được từ server
            secure: process.env.NODE_ENV === 'production', // Chỉ bật secure trong môi trường production
            sameSite: 'strict', // Chỉ gửi trong cùng domain
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });
        return { accessToken };
    }

    @Post('refresh-token')
    @ApiCookieAuth('refreshToken')
    @ApiOperation({ summary: 'Refresh Access Token', description: 'Generate a new access token using refresh token.' })
    @ApiResponse({
        status: 201,
        description: 'Token refreshed successfully',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
        },
    })
    @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
    async refreshToken(
        @Request() req: { cookies: { refreshToken: string } },
        @Res({ passthrough: true }) res: Response,
    ) {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw new BadRequestException('Refresh token not found');
        }
        const user = await this.authService.validateUserByRefreshToken(refreshToken);
        if (!user) {
            return { message: 'Invalid refresh token' };
        }
        const { accessToken, refreshToken: newRefreshToken } = await this.authService.signIn(user);
        // Đặt refresh token mới vào cookies
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return { accessToken };
    }

    @Get('profile')
    @ApiBearerAuth()
    @Roles('admin')
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
