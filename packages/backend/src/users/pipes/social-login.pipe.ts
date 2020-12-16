import { Env } from '@Common/enums/env.enum';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialLoginDto } from '@Users/dto/social-login.dto';
import { SocialType } from '@Users/enums/social-type.enum';
import {
	ISocialAccount,
	IUser,
} from '@Users/interfaces/user-document.interface';
import { TokenService } from '@Users/services/user-token.service';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class SocialLoginPipe implements PipeTransform {
	constructor(
		private readonly tokenService: TokenService,
		private readonly configService: ConfigService
	) {}

	async transform(
		value: SocialLoginDto
	): Promise<{ socialAccount: ISocialAccount; userData: IUser }> {
		const { token, type } = value;

		const key = CryptoJS.enc.Base64.parse(this.configService.get(Env.AES_KEY));
		const iv = CryptoJS.enc.Base64.parse(this.configService.get(Env.AES_IV));

		const tokenDecrypted = CryptoJS.AES.decrypt(token, key, { iv }).toString(
			CryptoJS.enc.Utf8
		);

		if (type === SocialType.GOOGLE) {
			return await this.tokenService
				.getGoogleAccessTokenInfo(tokenDecrypted)
				.catch(() => {
					throw new BadRequestException();
				});
		} else {
			throw new BadRequestException();
		}
	}
}
