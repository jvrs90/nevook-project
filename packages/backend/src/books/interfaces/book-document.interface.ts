import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { IUserDoc } from "@Users/interfaces/user-document.interface";
import { IAuthorDoc } from "@Authors/interfaces/author-document.interface";
import { IGenreDoc } from "@Genres/interfaces/genre-document.interface";
import { Document } from 'mongoose';



export type UserOrObjectID = IUserDoc | ObjectID;
export type GenreOrObjectID = IGenreDoc | ObjectID;
export type AuthorOrObjectID = IAuthorDoc | ObjectID;

export type TBookModel = IBookDoc<UserOrObjectID, GenreOrObjectID, AuthorOrObjectID>


export interface IBook<
    U extends UserOrObjectID = ObjectID,
    A extends AuthorOrObjectID = ObjectID,
    G extends GenreOrObjectID = ObjectID
    > {
    title: string;
    author: A;
    genre: G;
    slug?: string;
    synopsis?: string;
    cover?: string;
    isbn?: string;
    createdBy?: U;
}


export interface IBookDoc<
    U extends UserOrObjectID = ObjectID,
    A extends AuthorOrObjectID = ObjectID,
    G extends GenreOrObjectID = ObjectID,
    > extends IBook<U, A, G>, Document { }