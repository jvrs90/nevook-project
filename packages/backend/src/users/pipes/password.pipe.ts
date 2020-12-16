import { UserErrors } from '@Users/enums/user-errors.enum';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FormValidation } from 'nevook-utils';

/**
 * Password pipe validator
 */
@Injectable()
export class PasswordPipe implements PipeTransform {
	/**
	 * Password handler validator
	 *
	 * @param  {string} value
	 * @returns string
	 */
	transform(value: string): string {
		if (!FormValidation.passwordValidation(value))
			throw new BadRequestException(UserErrors.FORMAT_PASSWORD);
		return value;
	}
}
