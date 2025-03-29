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

    async authenticate(signinAuthDto: SigninAuthDto): Promise<AuthResponse> {
        const user = await this.validateUser(signinAuthDto);

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return this.signIn(user);
    }

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
        };
    }

    async signIn(user: SignInData): Promise<AuthResponse> {
        const tokenPayload = {
            sub: user.accountid ?? '',
            username: user.username ?? '',
        };
        const access_token = await this.jwtService.signAsync(tokenPayload);

        return {
            accessToken: access_token,
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
