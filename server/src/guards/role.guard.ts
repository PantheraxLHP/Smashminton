import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { AccountsService } from 'src/modules/accounts/accounts.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name); // Logger cho debug

  constructor(
    private readonly reflector: Reflector,
    private readonly accountService: AccountsService, // Inject AccountsService để truy vấn DB
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //Nếu route có `@Public()`, bỏ qua RolesGuard
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Metadata từ method
      context.getClass(),   // Metadata từ class
    ]);
    if (isPublic) {
      console.log('Public route, skipping Roles guard');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    //Nếu không có user, từ chối truy cập
    if (!user) {
      this.logger.warn('Unauthorized access attempt');
      return false;
    }

    //Lấy danh sách vai trò yêu cầu từ metadata (class + method)
    const classRoles = this.reflector.get<string[]>(ROLES_KEY, context.getClass()) || [];
    const methodRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler()) || [];
    const requiredRoles = [...classRoles, ...methodRoles]; // Hợp nhất vai trò

    //Nếu không yêu cầu vai trò nào, cho phép truy cập
    if (requiredRoles.length === 0) {
      return true;
    }

    //Truy vấn DB lấy vai trò của người dùng
    const userRoles = await this.accountService.findRoleByEmployeeId(user.accountid);
    if (!userRoles || userRoles.length === 0) {
      this.logger.warn(`User ${user.accountid} has no roles assigned`);
      return false;
    }

    //Kiểm tra xem user có vai trò phù hợp không
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    return hasRole;
  }
}