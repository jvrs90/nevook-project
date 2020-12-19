import Paginated from '@Common/types/paginate-filter.types';
import { ObjectType } from '@nestjs/graphql';
import { User } from '@Users/types/user.type';
import { Author } from '@Authors/types/author.type';
import { Genre } from '@Genres/types/genre.type';


@ObjectType()
export class Book {
    _id: string;
    title: string;
    slug?: string;
    synopsis?: string;
    cover?: string;
    author?: Author;
    genre?: Genre;
}

@ObjectType()
export class FullBook extends Book {
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}

@ObjectType()
export class BookPaginated extends Paginated<FullBook>(FullBook){}