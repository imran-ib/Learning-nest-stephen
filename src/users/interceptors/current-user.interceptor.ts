import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const Req = context.switchToHttp().getRequest();
    const userId = Req.session.userId;
    if (userId) {
      const user = await this.userService.findOne(userId);
      Req.CurrentUser = user;
    }
    return next.handle();
  }
}
