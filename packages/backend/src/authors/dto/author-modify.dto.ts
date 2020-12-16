import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { InputType, Field} from '@nestjs/graphql';

@InputType()
export class AuthorModifyDto {
    @Field()
    name?: string;
    @Field()
    slug?: string;
    @Field()
    bio?: string;
    @Field()
    photo?: string;
}