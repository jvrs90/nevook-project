import { Gender } from '@Common/enums/gender.enum';
import { SocialType } from '@Users/enums/social-type.enum';
import { Document } from 'mongoose';

export type IUserModel = IUserDoc;

export interface IUser {
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
	socialAccounts?: ISocialAccount[];

}

export interface ISocialAccount {
	id: string;
	type: SocialType;
}


export interface IUserDoc extends IUser,
		Document {}
