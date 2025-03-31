import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { AuthResponse, SignInData } from './interfaces/auth.interface';
@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountsService,
        private readonly jwtService: JwtService,
    ) {}

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
        return {
            accountid: user.accountid ?? '',
            username: user.username ?? '',
            accounttype: user.accounttype ?? '',
        };
    }

    async validateUserByRefreshToken(refreshToken: string): Promise<SignInData | null> {
        try {
            // Xác thực refresh token
            const payload: { sub: number; username: string; accounttype: string } = await this.jwtService.verifyAsync(
                refreshToken,
                {
                    secret: process.env.JWT_REFRESH_TOKEN_SECRET, // Sử dụng secret của refresh token
                },
            );

            // Lấy thông tin người dùng từ payload
            const user = {
                accountid: Number(payload.sub),
                username: payload.username,
                accounttype: payload.accounttype,
            };

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
    findAll() {
        return `This action returns all auth`;
    }

    findOne(id: number) {
        return `This action returns a #${id} auth`;
    }

    remove(id: number) {
        return `This action removes a #${id} auth`;
    }
}
