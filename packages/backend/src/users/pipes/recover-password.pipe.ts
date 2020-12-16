import { UserErrors } from '@Users/enums/user-errors.enum';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FormValidation, TokenValidation } from 'nevook-utils';
import { RecoverPasswordDto } from '../dto/recover-password.dto';

/**
 * RecoverPasswordDto pipe validator
 */
@Injectable()
export class RecoverPasswordPipe implements PipeTransform {
	/**
	 * RecoverPasswordDto handler validator
	 *
	 * @param  {RecoverPasswordDto} value
	 * @returns RecoverPasswordDto
	 */
	transform(value: RecoverPasswordDto): RecoverPasswordDto {
		const { newPassword, token } = value;

		if (!TokenValidation.validateJwt(token))
			throw new BadRequestException(UserErrors.FORMAT_TOKEN);

		if (!FormValidation.passwordValidation(newPassword))
			throw new BadRequestException(UserErrors.FORMAT_PASSWORD);

		return value;
	}
}
