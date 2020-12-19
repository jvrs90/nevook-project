import { FileProcessService } from '@Common/utils/file-process.service';
import {
	fileFilter,
	FOLDER_UPLOADS_USERS,
	imageStorage,
} from '@Common/utils/file-upload';
import {
	Controller,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetRestAuthUser } from '@Common/auth/get-user.decorator';
import { UserRestAuthGuard } from '@Users/auth/user-rest-auth.guard';
import { IUserDoc } from '@Users/interfaces/user-document.interface';
import { UsersService } from '@Users/services/users.service';
import { join } from 'path';

/**
 * User upload photo controller
 */
@Controller('user')
export class UserController {
	constructor(
		private userService: UsersService,
		private fileProcessService: FileProcessService
	) {}

	/**
	 * Endpoint upload user photo
	 *
	 * @param  {} file
	 * @param  {IUserDoc} user
	 * @returns Object
	 */
	@Post('upload')
	@UseGuards(UserRestAuthGuard)
	@UseInterceptors(
		FileInterceptor('photo', {
			fileFilter,
			storage: imageStorage,
			limits: { fileSize: 4 * 1024 * 1024 },
		})
	)
	async upload(
		@UploadedFile() file,
		@GetRestAuthUser() user: IUserDoc
	): Promise<{ url: string }> {
		if (!file) throw new BadRequestException();
		this.fileProcessService.transformImage(join(FOLDER_UPLOADS_USERS, file.filename));
		return {
			url: await this.userService.setPhoto(user, file.filename),
		};
	}
}
