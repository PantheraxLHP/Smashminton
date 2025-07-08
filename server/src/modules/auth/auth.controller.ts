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
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AccountsService } from '../accounts/accounts.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCookieAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInData } from '../../interfaces/auth.interface';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
@ApiTags('Authorization')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly accountsService: AccountsService,
    ) { }

    @Post('signin')
    @UseGuards(LocalAuthGuard)
    @Public()
    @ApiOperation({ summary: 'User Sign In', description: 'Authenticate user and return JWT token.' })
    @ApiBody({ type: SigninAuthDto })
    @ApiResponse({ status: 201, description: 'SignIn successful' })
    @ApiUnauthorizedResponse()
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

    @Post('signup')
    @Public()
    @ApiOperation({ summary: 'User Sign Up', description: 'Register a new user.' })
    @UseInterceptors(
        FilesInterceptor('studentCard', 2, {
            limits: {
                fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file: 5MB
            },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    @ApiConsumes('multipart/form-data') // Định nghĩa loại dữ liệu là multipart/form-data
    @ApiBody({
        description: 'Signup with profile pictures',
        type: SignupAuthDto,
    })
    async signUp(
        @Body() signupAuthDto: SignupAuthDto,
        @UploadedFiles() files: Express.Multer.File[], // Lấy danh sách file đã upload
    ) {
        return this.accountsService.createCustomer(
            {
                ...signupAuthDto,
                studentCard: files.map((file) => file.filename), // Lưu tên file vào DTO hoặc cơ sở dữ liệu
            },
            files, // Pass the files array as the second argument
        );
    }

    @Get('profile')
    @ApiBearerAuth()
    @Roles('hr_manager')
    getUserInfo(@Request() req: { user: SignInData }) {
        return req.user;
    }

    @Post('forgot-password')
    @Public()
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({ status: 200, description: 'Reset password link sent successfully' })
    @ApiResponse({ status: 400, description: 'Failed to send reset password link' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.identifier);
    }

    @Post('reset-password')
    @Public()
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    @ApiResponse({ status: 400, description: 'Failed to reset password' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}
