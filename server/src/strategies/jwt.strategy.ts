import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET', 'defaultSecret')
        });
    }

    async validate(payload: { sub: string; username: string; accounttype: string; role?: string }) {
        return { 
            accountid: payload.sub, 
            username: payload.username, 
            accounttype: payload.accounttype, 
            role: payload.role
        };
    }
}
