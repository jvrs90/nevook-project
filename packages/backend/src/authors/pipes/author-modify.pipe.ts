import { trimAllStrings } from '@Common/utils/clean-object';
import { CommonErrors } from '@Common/enums/common-errors.enum';
import { AuthorModifyDto } from '@Authors/dto/author-modify.dto';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AuthorValidation } from 'nevook-utils';
import { cleanObject } from '@Common/utils/clean-object';




@Injectable()
export class AuthorModifyPipe implements PipeTransform {
    transform(value: AuthorModifyDto): AuthorModifyDto {
        if (!Object.keys(value).length) throw new BadRequestException(CommonErrors.NOTHING_TO_MODIFY)

        const { name, bio } = value;
        const errors = [];

        if (name && !AuthorValidation.nameValidation(name))
            errors.push(CommonErrors.FORMAT_INVALID_TITLE)
        if (bio && !AuthorValidation.bioValidation(bio))
            errors.push(CommonErrors.FORMAT_INVALID_DESCRIPTION)
        if (errors.length > 0) {
            throw new BadRequestException(errors.join('. '));
        }

        cleanObject(value);
        trimAllStrings(value);

        return value;
    }
}