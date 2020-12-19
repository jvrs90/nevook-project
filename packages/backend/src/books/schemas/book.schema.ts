import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from '@Users/schemas/users.schema';
import { Author } from '@Authors/schemas/author.schema';
import { Genre } from '@Genres/schemas/genre.schema';
import { UserModels } from '@Users/enums/user-models.enum';
import { AuthorModels } from '@Authors/enums/author-models.enum';
import { GenreModels } from '@Genres/enums/genre-models.enum';

@Schema({timestamps: true, versionKey: false})
export class Book {
    @Prop({ type: String, required: true })
    title: string;

    @Prop()
    slug: string;

    @Prop()
    synopsis: string

    @Prop()
    cover: string;

    @Prop()
    isbn: string;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: AuthorModels.AUTHOR})
    author: Author;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: GenreModels.GENRE})
    genre: Genre;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: UserModels.USER})
    createdBy: User
}

export const BookSchema = SchemaFactory.createForClass(Book);