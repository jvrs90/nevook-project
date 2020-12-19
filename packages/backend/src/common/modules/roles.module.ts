import { Module } from '@nestjs/common';
import { AccessControlModule } from 'nest-access-control';
import { roles } from '@Users/enums/user-roles.enum';


@Module({
	imports: [
		AccessControlModule.forRoles(roles),
	]
})
export class RoleModule { }