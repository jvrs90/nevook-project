import { CommonErrors } from '@Common/enums/common-errors.enum';
import { trimAllStrings } from '@Common/utils/clean-object';
import { AuthorCreateDto } from '@Authors/dto/author-create.dto';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AuthorValidation } from 'nevook-utils';
import slugify from 'slugify'

@Injectable()
export class AuthorCreatePipe implements PipeTransform {
    transform(value: AuthorCreateDto): AuthorCreateDto {
        const { name, bio, slug } = value;

        const errors = [];

        if (!AuthorValidation.nameValidation(name))
            errors.push(CommonErrors.FORMAT_INVALID_TITLE);

        if (bio && !AuthorValidation.bioValidation(bio))
            errors.push(CommonErrors.FORMAT_INVALID_DESCRIPTION);

        if (!slug) {
            let modName: string;
            modName = name.replace(/[,]/gi, ' ');
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
