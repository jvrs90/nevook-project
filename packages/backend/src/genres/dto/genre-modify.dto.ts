import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { InputType, Field} from '@nestjs/graphql';

@InputType()
export class GenreModifyDto {
    @Field()
    name?: string;

    @Field()
    slug?: string;

    @Field()
    photo?: string;

}