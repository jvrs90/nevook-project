import { Document } from 'mongoose';
import { UserTokenTypes } from '../enums/user-token-types.enum';
import { ObjectID } from '@Common/interfaces/mongoose.interface';

export interface TokenDocument extends Document {
	token: string;
	user: ObjectID;
	type: UserTokenTypes;
	expiresAt: Date;
}
