import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TokenValidation } from 'nevook-utils';
import { TokenErrors } from '@Users/enums/token-errors.enum';

/**
 * Token pipe validator
 */
@Injectable()
export class TokenPipe implements PipeTransform {
	/**
	 * Token handler validator
	 *
	 * @param  {string} value
	 * @returns string
	 */
	transform(value: string): string {
		if (!TokenValidation.validateJwt(value))
			throw new BadRequestException(TokenErrors.TOKEN_NOT_FOUND);

		return value;
	}
}
