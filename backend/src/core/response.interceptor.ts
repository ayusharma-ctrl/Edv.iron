import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ResponseBaseDTO } from 'src/core/base.dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import ResponseConstants from 'src/constants/response.constants';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseBaseDTO<T>>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseBaseDTO<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: ResponseConstants.Common[200].code,
        message: ResponseConstants.Common[200].message,
        type:
          data === undefined
            ? 'undefined'
            : Array.isArray(data)
              ? 'array'
              : 'object',
        data: data,
      })),
    );
  }
}
