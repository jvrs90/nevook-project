import { CommonErrors } from '@Common/enums/common-errors.enum';
import { trimAllStrings } from '@Common/utils/clean-object';
import { GenreCreateDto } from '@Genres/dto/genre-create.dto';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { GenreValidation } from 'nevook-utils';
import slugify from 'slugify'

@Injectable()
export class GenreCreatePipe implements PipeTransform {
    transform(value: GenreCreateDto): GenreCreateDto {
        const { name, slug } = value;

        const errors = [];

        if (!GenreValidation.nameValidation(name))
            errors.push(CommonErrors.FORMAT_INVALID_TITLE);

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