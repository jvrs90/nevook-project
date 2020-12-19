import { GenericErrors } from '@Common/enums/generic-errors.enum';
import { JwtStrategies } from '@Common/enums/jwt-strategies.enum';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IUserDoc } from '@Users/interfaces/user-document.interface';


@Injectable()
export class UserGqlAuthGuard extends AuthGuard(JwtStrategies.USER) {
	/**
	 * Function to generate correct context for passport
	 *
	 * @param  {ExecutionContext} context
	 */
	canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const { req } = ctx.getContext();

		return super.canActivate(new ExecutionContextHost([req]));

	}

	handleRequest<T extends IUserDoc>(err: Error, user: T): T {
		if (err || !user) {
			throw err || new UnauthorizedException(GenericErrors.UNAUTHORIZED);
		}
		return user;
	}

}

