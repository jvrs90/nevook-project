import { UserErrors } from '@Users/enums/user-errors.enum';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FormValidation } from 'nevook-utils';
import { LoginDto } from '../dto/login.dto';

/**
 * LoginDto pipe validator
 */
@Injectable()
export class LoginPipe implements PipeTransform {
	/**
	 * LoginDto hanler validator
	 *
	 * @param  {LoginDto} value
	 * @returns LoginDto
	 */
	transform(value: LoginDto): LoginDto {
		if (
			!FormValidation.emailValidation(value.email) ||
			!FormValidation.passwordValidation(value.password)
		)
			throw new BadRequestException(UserErrors.INVALID_LOGIN);
		return value;
	}
}