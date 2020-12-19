
import { BadRequestException, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from 'path';
import { AuthorService } from "@Authors/services/author.service";
import { ObjectID } from "@Common/interfaces/mongoose.interface";
import { FileProcessService } from "@Common/utils/file-process.service";
import { FOLDER_UPLOADS_AUTHORS, imageAuthor, fileFilter } from "@Common/utils/file-upload";
import { UserRestAuthGuard } from "@Users/auth/user-rest-auth.guard";



@Controller('author')
export class AuthorController {
    constructor(
        private readonly authorService: AuthorService,
        private readonly fileProcessService: FileProcessService,
        private readonly configService: ConfigService
    ) {}

    @Post('/:id/image')
	@UseGuards(UserRestAuthGuard)
	@UseInterceptors(
		FileInterceptor('image', {
			fileFilter,
			storage: imageAuthor,
			limits: { fileSize: 4 * 1024 * 1024 },
		})
	)
	async uploadPhotoCourse(
		@UploadedFile() file,
		@Param('id') authorId: ObjectID
	) {
		if (!file) throw new BadRequestException();
		this.fileProcessService.transformImage(join(FOLDER_UPLOADS_AUTHORS, file.filename));
		return {
			url: await this.authorService.setAuthorImage(authorId, file.filename),
		};
	}
}