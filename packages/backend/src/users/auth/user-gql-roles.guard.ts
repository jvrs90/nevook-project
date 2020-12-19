import { BaseRoleGuard } from '@Common/auth/base-role.guard';
import { GenericErrors } from '@Common/enums/generic-errors.enum';
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRoles } from '@Users/enums/user-roles.enum';

@Injectable()
export class UserGqlRolesGuard extends BaseRoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<UserRoles[]>(
			'roles',
			context.getHandler()
		);

		if (!roles) throw new ForbiddenException(GenericErrors.UNAUTHORIZED);

		const user = GqlExecutionContext.create(context).getContext().req.user;

		return user


		// return this.isUserAllowed(user.roles, roles);
	}
}

