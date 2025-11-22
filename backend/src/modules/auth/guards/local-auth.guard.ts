import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    // Chỉ cần gọi xác thực, không gọi logIn
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}