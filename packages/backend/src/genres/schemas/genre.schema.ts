import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from '@Users/schemas/users.schema';
import { UserModels } from '@Users/enums/user-models.enum';

@Schema({timestamps: true, versionKey: false})
export class Genre {
    @Prop({ type: String, required: true })
    name: string;

    @Prop()
    slug: string;

    @Prop()
    photo: string;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: UserModels.USER})
    createdBy: User
}

export const GenreSchema = SchemaFactory.createForClass(Genre);