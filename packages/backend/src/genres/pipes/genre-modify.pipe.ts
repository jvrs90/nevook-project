import { trimAllStrings } from '@Common/utils/clean-object';
import { CommonErrors } from '@Common/enums/common-errors.enum';
import { GenreModifyDto } from '@Genres/dto/genre-modify.dto';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { GenreValidation } from 'nevook-utils';
import { cleanObject } from '@Common/utils/clean-object';


@Injectable()
export class GenreModifyPipe implements PipeTransform {
    transform(value: GenreModifyDto): GenreModifyDto {
        if (!Object.keys(value).length) throw new BadRequestException(CommonErrors.NOTHING_TO_MODIFY)

        const { name } = value;
        const errors = [];

        if (name && !GenreValidation.nameValidation(name))
            errors.push(CommonErrors.FORMAT_INVALID_TITLE)
        if (errors.length > 0) {
            throw new BadRequestException(errors.join('. '));
        }

        cleanObject(value);
        trimAllStrings(value);

        return value;
    }
}