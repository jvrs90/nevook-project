import { InputType, Field } from '@nestjs/graphql';
import { SocialType } from '@Users/enums/social-type.enum';

@InputType()
export class SocialUnlinkDto {
	@Field()
	id: string;
	@Field()
	type: SocialType;
}
