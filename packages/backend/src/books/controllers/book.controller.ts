
import { BadRequestException, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from 'path';
import { BookService } from "@Books/services/book.service";
import { ObjectID } from "@Common/interfaces/mongoose.interface";
import { FileProcessService } from "@Common/utils/file-process.service";
import { FOLDER_UPLOADS_BOOKS, imageBook, fileFilter } from "@Common/utils/file-upload";
import { UserRestAuthGuard } from "@Users/auth/user-rest-auth.guard";



@Controller('book')
export class BookController {
    constructor(
        private readonly bookService: BookService,
        private readonly fileProcessService: FileProcessService,
    ) {}

    @Post('/:id/image')
	@UseGuards(UserRestAuthGuard)
	@UseInterceptors(
		FileInterceptor('image', {
			fileFilter,
			storage: imageBook,
			limits: { fileSize: 4 * 1024 * 1024 },
		})
	)
	async uploadPhotoCourse(
		@UploadedFile() file,
		@Param('id') bookId: ObjectID
	) {
		if (!file) throw new BadRequestException();
		this.fileProcessService.transformImage(join(FOLDER_UPLOADS_BOOKS, file.filename));
		return {
			url: await this.bookService.setBookCover(bookId, file.filename),
		};
	}
}