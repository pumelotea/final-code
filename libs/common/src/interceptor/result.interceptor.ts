import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { R } from '@happykit/common/result';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((...args) => {
        return R.success(args[0]);
      }),
    );
  }
}
