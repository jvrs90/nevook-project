import { CommonErrors } from '@Common/enums/common-errors.enum';
import { trimAllStrings } from '@Common/utils/clean-object';
import { BookCreateDto } from '@Books/dto/book-create.dto';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { BookValidation } from 'nevook-utils';
import slugify from 'slugify'

@Injectable()
export class BookCreatePipe implements PipeTransform {
    transform(value: BookCreateDto): BookCreateDto {
        const { title, slug, synopsis, cover, author, genre, isbn } = value;

        const errors = [];

        if (!BookValidation.titleValidation(title))
            errors.push(CommonErrors.FORMAT_INVALID_TITLE);

        if (synopsis && !BookValidation.synopsisValidation(synopsis))
            errors.push(CommonErrors.FORMAT_INVALID_DESCRIPTION);

        if (!slug) {
            let modName: string;
            modName = title.replace(/[,]/gi, ' ');
            value.slug = slugify(modName, {
                replacement: '-',
                lower: true,
                remove: /[*+~.,()'"!:@]/gi
            })
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors.join('. '));
        }

        trimAllStrings(value);

        return value;
    }
}
