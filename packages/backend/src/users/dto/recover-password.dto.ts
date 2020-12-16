import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RecoverPasswordDto {
	@Field()
	token: string;
	@Field()
	newPassword: string;
}
