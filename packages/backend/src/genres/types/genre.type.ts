import Paginated from '@Common/types/paginate-filter.types';
import { ObjectType } from '@nestjs/graphql';
import { User } from '@Users/types/user.type';


@ObjectType()
export class Genre {
    _id: string;
    name: string;
    slug: string;
    photo?: string;
}

@ObjectType()
export class  FullGenre extends Genre {
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}

@ObjectType()
export class GenrePaginated extends Paginated<FullGenre>(FullGenre){}

