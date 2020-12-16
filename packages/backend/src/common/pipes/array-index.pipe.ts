import { CommonErrors } from '@Common/enums/common-errors.enum';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ArrayIndexPipe implements PipeTransform {
	transform(value: number): number {
		if (value < 0)
			throw new BadRequestException(CommonErrors.FORMAT_ARRAY_INDEX);

		return value;
	}
}