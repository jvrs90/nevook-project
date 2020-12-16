import { Env } from '@Common/enums/env.enum';
import { JwtStrategies } from '@Common/enums/jwt-strategies.enum';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserTokenPayload } from '@Users/interfaces/user-payload.interface';
import { decode } from 'jsonwebtoken';

export const JWTModule = JwtModule.registerAsync({
	inject: [ConfigService],
	useFactory: (configService: ConfigService): JwtModuleOptions => ({
		secretOrKeyProvider: (
			_requestType,
			tokenOrPayload: UserTokenPayload  | string,
			_options
		) => {
			let payload: any = tokenOrPayload;
			if (typeof tokenOrPayload === 'string') payload = decode(tokenOrPayload);

			if (payload.type === JwtStrategies.USER) {
				return configService.get(Env.USER_TOKEN_KEY);
            }
			else {
				Logger.warn('Invalid type token');
				return '';
			}
		},
	}),
});
