import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { AuthResponse, SignInData } from '../../interfaces/auth.interface';
import { isEmail } from 'class-validator';
import { NodemailerService } from '../nodemailer/nodemailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResetPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountsService,
        private readonly jwtService: JwtService,
        private readonly nodemailerService: NodemailerService,
        private readonly prisma: PrismaService,
    ) { }

    async validateUser(signinAuthDto: SigninAuthDto): Promise<SignInData | null> {
        const { username, password } = signinAuthDto;
        const user = await this.accountService.findByUsername(username);
        if (!user) {
            throw new BadRequestException('Username not found');
        }
        if (!user.password) {
            throw new BadRequestException('Password is null');
        }
        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Password not match');
        }

        if (user.accounttype === 'Employee') {
            const roleEmployee: string = await this.accountService.findRoleByEmployeeId(user.accountid);
            return {
                accountid: user.accountid ?? '',
                username: user.username ?? '',
                accounttype: user.accounttype ?? '',
                role: roleEmployee ?? '',
                avatarurl: user.avatarurl ?? ''
            };
        }
        const isStudent = await this.accountService.checkStudentCustomer(Number(user.accountid));

        return {
            accountid: user.accountid ?? '',
            username: user.username ?? '',
            accounttype: user.accounttype ?? '',
            avatarurl: user.avatarurl ?? '',
            isStudent: isStudent ?? false,
        };
    }

    async validateUserByRefreshToken(refreshToken: string): Promise<SignInData | null> {
        try {
            // Xác thực refresh token
            const payload: { sub: number; username: string; accounttype: string; role?: string; avatarurl?: string; isStudent?: boolean } =
                await this.jwtService.verifyAsync(refreshToken, {
                    secret: process.env.JWT_REFRESH_TOKEN_SECRET, // Sử dụng secret của refresh token
                });

            // Lấy thông tin người dùng từ payload
            const user = {
                accountid: Number(payload.sub),
                username: payload.username,
                accounttype: payload.accounttype,
                role: payload.role ?? '', // Nếu role không tồn tại, đặt giá trị là undefined
                avatarurl: payload.avatarurl ?? '',
                isStudent: payload.isStudent ?? false,
            };

            // Nếu accounttype là Employee và role không có trong payload, truy vấn role từ cơ sở dữ liệu
            if (user.accounttype === 'Employee' && user.role === '') {
                const roleEmployee: string = await this.accountService.findRoleByEmployeeId(user.accountid);
                user.role = roleEmployee ?? undefined; // Cập nhật role từ cơ sở dữ liệu
            }
            // Trả về thông tin người dùng
            return user;
        } catch {
            return null; // Trả về null nếu refresh token không hợp lệ
        }
    }

    async signIn(user: SignInData): Promise<AuthResponse> {
        const tokenPayload = {
            sub: user.accountid ?? '',
            username: user.username ?? '',
            accounttype: user.accounttype ?? '',
            ...(user.accounttype === 'Employee' && user.role ? { role: user.role } : {}), // Thêm role nếu là Employee
            avatarurl: user.avatarurl ?? '',
            isStudent: user.isStudent ?? false,
        };
        const access_token = await this.jwtService.signAsync(tokenPayload, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
        });

        const refresh_token = await this.jwtService.signAsync(tokenPayload, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
        });

        return {
            accessToken: access_token,
            refreshToken: refresh_token,
        };
    }

    async forgotPassword(identifier: string): Promise<any> {
        let user: any = null;
        if (isEmail(identifier)) {
            user = await this.accountService.findByEmail(identifier);
            if (!user) {
                throw new BadRequestException('Email not found');
            }
        } else {
            user = await this.accountService.findByUsername(identifier);
            if (!user) {
                throw new BadRequestException('Username not found');
            }
        }
        if (!user.email) {
            throw new BadRequestException('User does not have an email');
        }
        // Tạo token jwt chứa accountid, hết hạn 15 phút
        const token = await this.jwtService.signAsync(
            { accountid: user.accountid },
            { expiresIn: '15m' }
        );
        // Tạo link reset password
        const resetLink = `${process.env.CLIENT || 'http://localhost:3000'}/reset-password?token=${token}`;
        // Gửi email
        const info = await this.nodemailerService.sendResetPassword({ email: user.email, link: resetLink });
        if (!info) {
            throw new BadRequestException('Failed to send reset password link');
        }
        return {
            message: 'Reset password link sent successfully',
            success: true
        };
    }

    async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
        try {

            if (dto.newPassword !== dto.confirmPassword) {
                throw new BadRequestException('Password and confirm password do not match');
            }

            const payload: any = await this.jwtService.verifyAsync(dto.token);
            const accountid = payload.accountid;
            if (!accountid) {
                throw new BadRequestException('Invalid or expired token');
            }

            // Tìm user theo accountid
            const user = await this.prisma.accounts.findUnique({
                where: { accountid: accountid }
            });
            if (!user) {
                throw new BadRequestException('User not found');
            }

            // Cập nhật mật khẩu
            const updatedUser = await this.accountService.updatePassword(accountid, dto.newPassword);
            if (!updatedUser) {
                throw new BadRequestException('Failed to update password');
            }

            return { message: 'Password reset successfully' };
        } catch (err) {
            throw new BadRequestException('Invalid or expired token');
        }
    }
}
