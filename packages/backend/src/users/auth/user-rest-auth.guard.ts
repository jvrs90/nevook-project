import { UserErrors } from '@Users/enums/user-errors.enum';
import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GenericErrors } from '@Common/enums/generic-errors.enum';
import { JwtStrategies } from '@Common/enums/jwt-strategies.enum';

/**
 * Rest Auth guard
 */
@Injectable()
export class UserRestAuthGuard extends AuthGuard(JwtStrategies.USER) {
	/**
	 * @ignore
	 */
	canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}

	/**
	 * Handler for auth request and return object identification user to passport
	 *
	 * @param  {any} err
	 * @param  {any} user
	 * @returns any
	 */
	handleRequest(err: any, user: any): any {
		if (err || !user) {
			throw err || new UnauthorizedException(GenericErrors.UNAUTHORIZED);
		}
		return user;
	}
}
