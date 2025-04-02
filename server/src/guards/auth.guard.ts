import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException('Missing authorization header');
        }

        // Now safely split after checking it exists
        const token = authorization.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Invalid token format');
        }

        try {
            // Rest of your code remains the same
            const tokenPayload = await this.jwtService.verifyAsync(token);
            request.user = {
                accountid: tokenPayload.sub,
                username: tokenPayload.username,
            };
            return true;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
