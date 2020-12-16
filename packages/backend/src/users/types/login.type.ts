import { ObjectType } from '@nestjs/graphql';
import { ProfileUser } from './user.type';

/**
 * GraphQL Login Definition
 */
@ObjectType()
export class Login {
	token: string;
	user: ProfileUser;
}
