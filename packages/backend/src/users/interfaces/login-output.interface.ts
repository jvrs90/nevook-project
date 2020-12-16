import { ProfileUser } from '@Users/types/user.type';

export interface LoginOutput {
	token: string;
	user: ProfileUser;
}
