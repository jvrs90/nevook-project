import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { IUserDoc } from "@Users/interfaces/user-document.interface";
import { Document } from 'mongoose';

export type UserOrObjectID = IUserDoc | ObjectID;

export type TAuthorModel = IAuthorDoc<UserOrObjectID>;

export interface IAuthor<U extends UserOrObjectID = ObjectID> {
    name: string;
    slug?: string;
    bio?: string;
    photo?: string;
    createdBy?: U;
}

export interface IAuthorDoc<U extends UserOrObjectID = ObjectID> extends IAuthor<U>, Document{}