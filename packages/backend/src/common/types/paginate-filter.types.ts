import { Type } from '@nestjs/common';

import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

export default function Paginated<TItem>(TItemClass: Type<TItem>): any {
	const { name } = TItemClass;
	@ObjectType(`${name}Paginated`, { isAbstract: true })
	class Paginated<TItem> {
		@Field(() => [TItemClass!])
		data!: TItem[];

		@Field(() => Int)
		offset!: number;

		@Field(() => Int)
		limit!: number;

		@Field(() => Int)
		total!: number;
	}

	return Paginated;
}

@InputType()
export class PaginateDto {
	@Field(() => Int, { nullable: true })
	offset!: number;

	@Field(() => Int, { nullable: true })
	limit!: number;
}
