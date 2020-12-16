import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IUserDoc } from '@Users/interfaces/user-document.interface';

/**
 * GQL decorator for get auth user
 */
export const GetGqlAuthUser = createParamDecorator(
	(_, ctx: GqlExecutionContext): IUserDoc =>
		GqlExecutionContext.create(ctx).getContext().req.user
);

/**
 * Rest decorator for get auth user
 */
export const GetRestAuthUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): IUserDoc => {
		const request = ctx.switchToHttp().getRequest();
		return request.user;
	}
);
