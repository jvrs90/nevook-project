import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterDto {
	@Field()
	email: string;

	@Field()
	name: string;

	@Field()
	surname: string;

	@Field()
	password: string;

    @Field()
	alias?: string;

    @Field()
	username?: string;
}
