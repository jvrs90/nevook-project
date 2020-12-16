import { isValidObjectId } from 'mongoose';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectID } from '@Common/interfaces/mongoose.interface';
import { CommonErrors } from '@Common/enums/common-errors.enum';

/**
 * Array id's validator
 */
@Injectable()
export class ObjectIDArrayPipe implements PipeTransform {
	/**
	 * Array handler validator
	 *
	 * @param  {ObjectID[]} values Array of ID's courses
	 * @returns ObjectID[]
	 */
	transform(values?: string[]): ObjectID[] {
		values &&
			values.forEach(course => {
				if (!isValidObjectId(course))
					throw new BadRequestException(CommonErrors.FORMAT_OBJECT_ID);
			});

		return values;
	}
}