import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserModels } from '@Users/enums/user-models.enum';
import { UserTokenTypes } from '@Users/enums/user-token-types.enum';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from './users.schema';

@Schema()
export class UserToken {
	@Prop({ type: String, required: true, unique: true, index: true })
	token: string;

	@Prop({ type: MongooseSchema.Types.ObjectId, ref: UserModels.USER })
	user: User;

	@Prop({ type: String, enum: Object.values(UserTokenTypes) })
	type: UserTokenTypes;

	@Prop({
		type: Date,
		required: true,
		index: { expires: 1, sparse: true },
	})
	expiresAt: Date;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);