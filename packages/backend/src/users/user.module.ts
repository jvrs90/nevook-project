
import { JwtStrategies } from '@Common/enums/jwt-strategies.enum';
import { JWTModule } from '@Common/modules/jwt.module';
import { FileProcessService } from '@Common/utils/file-process.service';
import { imageStorage } from '@Common/utils/file-upload';
import { MailService } from '@Common/utils/mail.service';

import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { UserGqlAuthGuard } from './auth/user-gql-auth.guard';
import { UserJwtStrategy } from './auth/user-jwt.strategy';
import { UserController } from './controllers/user.controller';
import { UserModels } from './enums/user-models.enum';
import { userTokenProviders } from './providers/user-token.providers';
import { userProviders } from './providers/user.providers';
import { UserTokenSchema } from './schemas/user-token.schema';
import { UserSchema } from './schemas/users.schema';
import { UsersService } from './services/users.service';

@Module({
	imports: [
		JWTModule,
		PassportModule.register({
			defaultStrategy: JwtStrategies.USER,
		}),
		MongooseModule.forFeature([
			{ name: UserModels.USER, schema: UserSchema },
			{ name: UserModels.TOKEN, schema: UserTokenSchema },
		]),
		MulterModule.register({
			storage: imageStorage,
		}),
		HttpModule,
	],
	providers: [
		...userProviders,
		...userTokenProviders,
		UserGqlAuthGuard,
		// TODO: Estos providers no deberían ir en common?
		MailService,
		FileProcessService,
	],
	controllers: [UserController],
	exports: [UsersService, UserJwtStrategy, UserGqlAuthGuard],
})
export class UsersModule {}
