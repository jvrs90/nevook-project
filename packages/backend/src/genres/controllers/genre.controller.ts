
import { BadRequestException, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from 'path';
import { GenreService } from "@Genres/services/genre.service";
import { ObjectID } from "@Common/interfaces/mongoose.interface";
import { FileProcessService } from "@Common/utils/file-process.service";
import { FOLDER_UPLOADS_AUTHORS, imageGenre, fileFilter } from "@Common/utils/file-upload";
import { UserRestAuthGuard } from "@Users/auth/user-rest-auth.guard";



@Controller('genre')
export class GenreController {
    constructor(
        private readonly genreService: GenreService,
        private readonly fileProcessService: FileProcessService,
        private readonly configService: ConfigService
    ) {}

    @Post('/:id/image')
	@UseGuards(UserRestAuthGuard)
	@UseInterceptors(
		FileInterceptor('image', {
			fileFilter,
			storage: imageGenre,
			limits: { fileSize: 4 * 1024 * 1024 },
		})
	)
	async uploadPhotoCourse(
		@UploadedFile() file,
		@Param('id') genreId: ObjectID
	) {
		if (!file) throw new BadRequestException();
		this.fileProcessService.transformImage(join(FOLDER_UPLOADS_AUTHORS, file.filename));
		return {
			url: await this.genreService.setGenreImage(genreId, file.filename),
		};
	}
}