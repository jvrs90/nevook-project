import { UserErrors } from '@Users/enums/user-errors.enum';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FormValidation } from 'nevook-utils';
import { RegisterDto } from '../dto/register.dto';

/**
 * RegisterDto pipe validator
 */
@Injectable()
export class RegisterPipe implements PipeTransform {
	/**
	 * RegisterDto handler validator
	 *
	 * @param  {RegisterDto} value
	 * @returns RegisterDto
	 */
	transform(value: RegisterDto): RegisterDto {
		const { email, name, surname, password } = value;

		const errors = [];

		if (!FormValidation.emailValidation(email))
			errors.push(UserErrors.FORMAT_EMAIL);

		if (!FormValidation.nameValidation(name))
			errors.push(UserErrors.FORMAT_NAME);

		if (!FormValidation.nameValidation(surname))
			errors.push(UserErrors.FORMAT_SURNAME);

		if (!FormValidation.passwordValidation(password))
			errors.push(UserErrors.FORMAT_PASSWORD);

		if (errors.length > 0) {
			throw new BadRequestException(errors.join('. '));
		}

		return value;
	}
}
