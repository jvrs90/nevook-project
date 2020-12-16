import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { Env } from '@Common/enums/env.enum';

/**
 * Mongoose configuration module with env
 */
export const DatabaseModule = MongooseModule.forRootAsync({
	imports: [ConfigModule],
	useFactory: (configService: ConfigService): MongooseModuleOptions => ({
		uri: configService.get(Env.DATABASE_URI),
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true,
		useCreateIndex: true,
	}),
	inject: [ConfigService],
});
