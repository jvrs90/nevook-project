import { Provider } from '@nestjs/common';
import { UserJwtStrategy } from '@Users/auth/user-jwt.strategy';
import { UsersResolver } from '@Users/resolvers/users.resolver';
import { UsersService } from '@Users/services/users.service';

export const userProviders: Provider[] = [
	UsersService,
	UsersResolver,
	UserJwtStrategy,
];
