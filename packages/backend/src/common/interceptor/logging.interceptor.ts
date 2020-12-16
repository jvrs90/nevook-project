import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Logger,
	NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, OperatorFunction } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';

/**
 * Interceptor for add logs and custom timeout to any incoming request
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	/**
	 * Interfector delegate function
	 *
	 * @param  {ExecutionContext} context
	 * @param  {CallHandler} next
	 * @returns Observable
	 */
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const now = Date.now();
		if (context.getType() === 'http') {
			const req = context.switchToHttp().getRequest();
			const method = req.method;
			const url = req.url;
			return next.handle().pipe(
				tap(() =>
					Logger.log(
						`${method} ${url} ${Date.now() - now}ms`,
						context.getClass().name
					)
				),
				this.timeoutWhen(url !== '/course/uploadPublicVideo', 5000)
			);
		} else if (context.getType<GqlContextType>() === 'graphql') {
			const ctx: any = GqlExecutionContext.create(context);
			const resolverName = ctx.constructorRef.name;
			const info = ctx.getInfo();
			return next.handle().pipe(
				tap(() =>
					Logger.log(
						`${info.parentType} "${info.fieldName}" ${Date.now() - now}ms`,
						resolverName
					)
				),
				timeout(5000)
			);
		}
	}

	private timeoutWhen<T>(cond: boolean, value: number): OperatorFunction<T, T> {
		return function (source: Observable<T>): Observable<T> {
			return cond ? source.pipe(timeout(value)) : source;
		};
	}
}
