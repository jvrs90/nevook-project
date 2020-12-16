import Paginated from '@Common/types/paginate-filter.types';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { User } from '@Users/types/user.type';


@ObjectType()
export class Author {
    _id: string;
    slug: string;
    name: string;
    bio: string;
    photo: string;
}

@ObjectType()
export class  FullAuthor extends Author {
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}

@ObjectType()
export class AuthorPaginated extends Paginated<FullAuthor>(FullAuthor){}

