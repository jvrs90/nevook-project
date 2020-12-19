import { trimAllStrings, cleanObject } from '@Common/utils/clean-object';
import { CommonErrors } from '@Common/enums/common-errors.enum';
import { BookModifyDto } from '@Books/dto/book-modify.dto';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { BookValidation } from 'nevook-utils';




@Injectable()
export class BookModifyPipe implements PipeTransform {
    transform(value: BookModifyDto): BookModifyDto {
        if (!Object.keys(value).length) throw new BadRequestException(CommonErrors.NOTHING_TO_MODIFY)

        const { title, slug, synopsis, isbn, author, genre  } = value;
        const errors = [];

        if (title && !BookValidation.titleValidation(title))
            errors.push(CommonErrors.FORMAT_INVALID_TITLE)
        if (synopsis && !BookValidation.synopsisValidation(synopsis))
            errors.push(CommonErrors.FORMAT_INVALID_DESCRIPTION)
        if (errors.length > 0) {
            throw new BadRequestException(errors.join('. '));
        }

        cleanObject(value);
        trimAllStrings(value);

        return value;
    }
}