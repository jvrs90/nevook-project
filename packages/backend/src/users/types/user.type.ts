import { Gender } from '@Common/enums/gender.enum';
import { ObjectID } from '@Common/interfaces/mongoose.interface';
import Paginated from '@Common/types/paginate-filter.types';
import { ObjectType } from '@nestjs/graphql';
import { SocialType } from '@Users/enums/social-type.enum';

/**
 * GraphQL User Definition
 */
@ObjectType()
export class User {
	_id: string;
	email: string;
	name: string;
    surname: string;
    active: boolean;
    webUrl?: string;
    alias?: string;
	password?: string;
    username?: string;
	photo?: string;
	bio?: string;
	gender?: Gender;
	birthDate?: Date;
	socialAccounts?: SocialAccount[];
}

@ObjectType()
export class ProfileUser extends User {
	isSocialLogin: boolean;
}

@ObjectType()
class SocialAccount {
	id: string;
	type: SocialType;
}


@ObjectType()
export class UserPaginated extends Paginated<User>(User) {}
