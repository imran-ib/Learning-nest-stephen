import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersService } from '../users.service';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.CurrentUser;
    return user;
  },
);
