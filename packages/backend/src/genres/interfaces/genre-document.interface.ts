import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { IUser, IUserDoc } from "@Users/interfaces/user-document.interface";
import { Document } from 'mongoose';

export type UserOrObjectID = IUserDoc | ObjectID;

export type TGenreModel = IGenreDoc<UserOrObjectID>;

export interface IGenre<U extends UserOrObjectID = ObjectID> {
    name: string;
    slug?: string;
    photo?: string;
    createdBy?: U;
}

export interface IGenreDoc<U extends UserOrObjectID = ObjectID> extends IGenre<U>, Document{}