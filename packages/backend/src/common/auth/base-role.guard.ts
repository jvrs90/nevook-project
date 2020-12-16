import { GenericErrors } from '@Common/enums/generic-errors.enum';
import { ForbiddenException } from '@nestjs/common';
import { UserRoles } from '@Users/enums/user-roles.enum';

export abstract class BaseRoleGuard {
	protected isUserAllowed(
		userRoles: UserRoles[],
		allowedRoles: UserRoles[]
	) {
		for (const userRole of userRoles) {
			for (const allowedRole of allowedRoles) {
				if (userRole === allowedRole) return true;
			}
		}

		throw new ForbiddenException(GenericErrors.UNAUTHORIZED);
	}
}
