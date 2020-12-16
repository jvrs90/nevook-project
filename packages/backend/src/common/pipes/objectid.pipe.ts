import { isValidObjectId } from 'mongoose';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { CommonErrors } from '@Common/enums/common-errors.enum';

/**
 * Object id's validator
 */
@Injectable()
export class ObjectIDPipe implements PipeTransform {
	/**
	 * ObjectID handler validator
	 *
	 * @param  {ObjectID}
	 * @returns ObjectID
	 */
	transform(value: string): ObjectID {
		if (!isValidObjectId(value))
			throw new BadRequestException(CommonErrors.FORMAT_OBJECT_ID);

		return value;
	}
}