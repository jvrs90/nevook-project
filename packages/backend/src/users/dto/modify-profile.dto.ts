import { Gender } from '@Common/enums/gender.enum';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ModifyProfileDto {
	@Field({ nullable: true })
	name?: string;

	@Field({ nullable: true })
	surname?: string;

	@Field({ nullable: true })
	alias?: string;

	@Field({ nullable: true })
	bio?: string;

	@Field({ nullable: true })
	webUrl?: string;

	@Field({ nullable: true })
	gender?: Gender;

	@Field({ nullable: true })
	birthDate?: Date;
}
