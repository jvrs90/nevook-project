import { Env } from '@Common/enums/env.enum';
import { FOLDER_UPLOADS } from '@Common/utils/file-upload';
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
				rootPath: FOLDER_UPLOADS,
				serveRoot: configService.get(Env.UPLOADS_STATICS_PATH),
				serveStaticOptions: {
					index: false,
				},
			},
		];
	},
	inject: [ConfigService],
});
