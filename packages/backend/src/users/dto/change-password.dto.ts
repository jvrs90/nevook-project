import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChangePasswordDto {
	@Field({ nullable: true })
	oldPassword: string;
	@Field()
	newPassword: string;
}
