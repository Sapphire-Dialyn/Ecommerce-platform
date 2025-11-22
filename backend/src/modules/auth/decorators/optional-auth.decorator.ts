import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Optional Auth Decorator
 * Cho phép request mà không cần token (GUEST)
 * Nếu có token hợp lệ thì extract user info
 */
export const OptionalAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user || { role: 'GUEST' };
  },
);
