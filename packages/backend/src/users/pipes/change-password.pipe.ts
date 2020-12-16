import { UserErrors } from '@Users/enums/user-errors.enum';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ChangePasswordDto } from '@Users/dto/change-password.dto';
import { FormValidation } from 'nevook-utils';

@Injectable()
export class ChangePasswordPipe implements PipeTransform {
	transform(value: ChangePasswordDto) {
		if (value.oldPassword === value.newPassword)
			throw new BadRequestException(UserErrors.FORMAT_SAME_PASSWORD);

		if (
			value.oldPassword &&
			!FormValidation.passwordValidation(value.oldPassword)
		)
			throw new BadRequestException(UserErrors.FORMAT_PASSWORD);
		if (!FormValidation.passwordValidation(value.newPassword))
			throw new BadRequestException(UserErrors.FORMAT_PASSWORD);

		return value;
	}
}
