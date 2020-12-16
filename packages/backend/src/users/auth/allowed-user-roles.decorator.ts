import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '@Users/enums/user-roles.enum';

export const AllowedUserRoles = (...roles: UserRoles[]) =>
	SetMetadata('roles', roles);