import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender } from '@Common/enums/gender.enum';
import { SocialType } from '@Users/enums/social-type.enum';

type SocialAccountsProps = 'id' | 'type';

interface ISocialAccountsProps {
	id: string[];
	type: string[];
}

@Schema({timestamps: true, versionKey: false})
export class User {
	@Prop({ type: String, required: true, unique: true })
	email: string;

	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String, required: true })
	surname: string;

	@Prop({ type: String })
	password: string;

	@Prop({ type: Boolean, required: true, default: false })
	active: boolean;

	@Prop({ type: String })
    username: string;

    @Prop({ type: String })
    alias: string;

    @Prop({ type: String })
	webUrl: string;

	@Prop({ type: String })
	photo: string;

	@Prop({ type: String })
	bio: string;

	@Prop({ type: String, enum: Object.values(Gender) })
	gender: Gender;

	@Prop({ type: Date })
	birthDate: Date;

	@Prop(
		raw([
			{
				id: { type: String, required: true },
				type: { type: String, enum: Object.values(SocialType) },
			},
		])
	)
	socialAccounts: Record<SocialAccountsProps, ISocialAccountsProps>;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });
UserSchema.index({ 'socialAccounts.id': 1, 'socialAccounts.type': 1 });
