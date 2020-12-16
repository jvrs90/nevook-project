import { Env } from '@Common/enums/env.enum';
import { JwtStrategies } from '@Common/enums/jwt-strategies.enum';
import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { SocialType } from '@Users/enums/social-type.enum';
import { UserModels } from '@Users/enums/user-models.enum';
import { UserTokenTypes } from '@Users/enums/user-token-types.enum';
import { TokenErrors } from '@Users/enums/token-errors.enum';
import {
	ISocialAccount,
	IUser,
} from '@Users/interfaces/user-document.interface';
import { TokenDocument } from '@Users/interfaces/token-document.interface';
import { UserTokenPayload } from '@Users/interfaces/user-payload.interface';
import { GoogleProfileInfo } from '@Users/interfaces/google-profile-info.interface';
import { ClientSession, Model } from 'mongoose';
import { map } from 'rxjs/operators';

/**
 * Token Model service manager
 */
@Injectable()
export class TokenService {
	/**
	 * @ignore
	 */
	constructor(
		@InjectModel(UserModels.TOKEN)
		private readonly tokenModel: Model<TokenDocument>,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly httpService: HttpService
	) {}

	/**
	 * Tokens expiration definition by type
	 */
	private readonly TOKEN_EXPIRATION = {
		[UserTokenTypes.ACTIVATE_TOKEN]:
			1000 *
			60 *
			60 *
			24 *
			Number(this.configService.get(Env.USER_TOKEN_ACTIVATE_LIFE)),
		[UserTokenTypes.RECOVER_TOKEN]:
			1000 *
			60 *
			60 *
			24 *
			Number(this.configService.get(Env.USER_TOKEN_RECOVER_LIFE)),
	};

	/**
	 * JWT token sign generator and save to db
	 *
	 * @param  {string} userId
	 * @param  {UserTokenTypes} type
	 * @param  {ClientSession} session?
	 * @returns Promise
	 */
	async generateToken(
		userId: string,
		type: UserTokenTypes,
		session?: ClientSession
	): Promise<string> {
		const expiration = this.TOKEN_EXPIRATION[type];

		const payload: UserTokenPayload = {
			id: userId,
			type: JwtStrategies.USER,
		};

		const token = await this.jwtService.signAsync(payload, {
			expiresIn: expiration,
		});

		if (session)
			await this.tokenModel.create(
				[
					{
						token,
						type,
						user: userId,
						expiresAt: new Date(Date.now() + expiration),
					},
				],
				{ session }
			);
		else
			await this.tokenModel.create({
				token,
				type,
				user: userId,
				expiresAt: new Date(Date.now() + expiration),
			});

		return token;
	}

	/**
	 * JWT token validation and check with db
	 *
	 * @param  {string} token
	 * @returns Promise
	 */
	async checkToken(token: string): Promise<UserTokenPayload> {
		const payload: UserTokenPayload | null = await this.jwtService
			.verifyAsync(token)
			.catch(e => null);
		const tokenFound = await this.tokenModel.findOne({ token }).exec();
		if (tokenFound && payload) return payload;

		throw new BadRequestException(TokenErrors.TOKEN_NOT_FOUND);
	}

	/**
	 * Token db remove method
	 *
	 * @param  {string} token
	 * @param  {ClientSession} session
	 * @returns Promise
	 */
	async removeToken(token: string, session: ClientSession): Promise<boolean> {
		const result = await this.tokenModel
			.deleteOne({ token }, { session })
			.exec();
		if (result.n !== 1 || result.ok !== 1)
			throw new BadRequestException(TokenErrors.TOKEN_NOT_FOUND);
		return true;
	}

	/**
	 * Get Google Profile info from acces token
	 *
	 * @param  {string} accessToken
	 * @returns Promise
	 */
	getGoogleAccessTokenInfo(
		accessToken: string
	): Promise<{ socialAccount: ISocialAccount; userData: IUser }> {
		return this.httpService
			.get<GoogleProfileInfo>('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.pipe(
				map(data => ({
					socialAccount: {
						id: data.data.id,
						type: SocialType.GOOGLE,
					},
					userData: {
						email: data.data.email,
						name: data.data.given_name,
						surname: data.data.family_name,
						active: true,
						photo: data.data.picture,
					},
				}))
			)
			.toPromise();
	}

}
