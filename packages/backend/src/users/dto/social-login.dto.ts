import { InputType, Field } from '@nestjs/graphql';
import { SocialType } from '@Users/enums/social-type.enum';

@InputType()
export class SocialLoginDto {
	@Field()
	token: string;
	@Field()
	type: SocialType;
}
