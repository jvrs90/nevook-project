
import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { InputType, Field} from '@nestjs/graphql';

@InputType()
export class BookModifyDto {
    @Field()
    title?: string;

    @Field()
    author?: ObjectID;

    @Field()
    genre?: ObjectID;

    @Field()
    isbn?: string;

    @Field()
    slug?: string;

    @Field()
    synopsis?: string;

    @Field()
    cover?: string;

}
