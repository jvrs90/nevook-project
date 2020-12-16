import { UserErrors } from '@Users/enums/user-errors.enum';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FormValidation } from 'nevook-utils';

/**
 * Username pipe validator
 */
@Injectable()
export class UsernamePipe implements PipeTransform {
	/**
	 * Username handler validator
	 *
	 * @param  {string} value
	 * @returns string
	 */
	transform(value: string): string {
		if (!FormValidation.usernameValidation(value))
			throw new BadRequestException(UserErrors.FORMAT_USERNAME);
		return value;
	}
}
