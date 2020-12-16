import { UserErrors } from '@Users/enums/user-errors.enum';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FormValidation } from 'nevook-utils';

/**
 * Email pipe implementation
 */
@Injectable()
export class EmailPipe implements PipeTransform {
	/**
	 * Check if value is an email
	 *
	 * @param  {string} value
	 * @returns string
	 */
	transform(value: string): string {
		if (!FormValidation.emailValidation(value))
			throw new BadRequestException(UserErrors.FORMAT_EMAIL);
		return value;
	}
}