import { CommonErrors } from '@Common/enums/common-errors.enum';
import { GenderValues } from '@Common/enums/gender.enum';
import { cleanObject, trimAllStrings } from '@Common/utils/clean-object';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserErrors } from '@Users/enums/user-errors.enum';
import { FormValidation } from 'nevook-utils';
import { ModifyProfileDto } from '../dto/modify-profile.dto';

/**
 * ModifyProfileDto pipe validator
 */
@Injectable()
export class ModifyProfilePipe implements PipeTransform {
	/**
	 * ModifyProfileDto handler validator
	 *
	 * @param value Original dto
	 * @returns Clean dto
	 */
	transform(value: ModifyProfileDto): ModifyProfileDto {
		if (!Object.keys(value).length)
			throw new BadRequestException(CommonErrors.NOTHING_TO_MODIFY);

		const { name, surname, bio, birthDate, gender } = value;

		const errors = [];

		if (name && !FormValidation.nameValidation(name))
			errors.push(UserErrors.FORMAT_NAME);

		if (surname && !FormValidation.nameValidation(surname))
			errors.push(UserErrors.FORMAT_SURNAME);

		if (
			typeof bio === 'string' &&
			bio !== '' &&
			!FormValidation.bioValidation(bio)
		)
			errors.push(UserErrors.FORMAT_BIO);

		if (birthDate && !FormValidation.birthDateValidation(birthDate))
			errors.push(UserErrors.FORMAT_BIRTHDATE);

		if (gender && !GenderValues.includes(gender))
			errors.push(UserErrors.FORMAT_GENDER);

		if (errors.length > 0) {
			throw new BadRequestException(errors.join('. '));
		}

		cleanObject(value);
		trimAllStrings(value);

		return value;
	}
}
