import { Env } from '@Common/enums/env.enum';
import {
	FOLDER_UPLOADS_AUTHORS,
	FOLDER_UPLOADS_BOOKS,
	FOLDER_UPLOADS_GENRES,
	FOLDER_UPLOADS_USERS
} from '@Common/utils/file-upload';
import { ConfigService } from '@nestjs/config';
import {
	ServeStaticModule,
	ServeStaticModuleOptions,
} from '@nestjs/serve-static';

/**
 * ServerStatis module configuration
 */
export const StaticsModule = ServeStaticModule.forRootAsync({
	useFactory: (configService: ConfigService): ServeStaticModuleOptions[] => {
		return [
			{
				rootPath: FOLDER_UPLOADS_USERS,
				serveRoot: configService.get(Env.UPLOADS_STATICS_PATH_USERS),
				serveStaticOptions: {
					index: false,
				},
			},
			{
				rootPath: FOLDER_UPLOADS_BOOKS,
				serveRoot: configService.get(Env.UPLOADS_STATICS_PATH_BOOKS),
				serveStaticOptions: {
					index: false,
				},
			},
			{
				rootPath: FOLDER_UPLOADS_AUTHORS,
				serveRoot: configService.get(Env.UPLOADS_STATICS_PATH_AUTHORS),
				serveStaticOptions: {
					index: false,
				},
			},
			{
				rootPath: FOLDER_UPLOADS_GENRES,
				serveRoot: configService.get(Env.UPLOADS_STATICS_PATH_GENRES),
				serveStaticOptions: {
					index: false,
				},
			},
		];
	},
	inject: [ConfigService],
});
