import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model, ClientSession } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { promises as fspromises } from 'fs';
import { resolve } from 'path';
import { compare, hash } from 'bcrypt';
import { Env } from '@Common/enums/env.enum';
import { FOLDER_UPLOADS_USERS } from '@Common/utils/file-upload';
import { IPaginate, ObjectID } from '@Common/interfaces/mongoose.interface';
import { MailService } from '@Common/utils/mail.service';
import { JwtStrategies } from '@Common/enums/jwt-strategies.enum';
import { UserModels } from '@Users/enums/user-models.enum';
import { IUserModel, ISocialAccount, IUser } from '@Users/interfaces/user-document.interface';
import { IUserDoc } from '@Users/interfaces/user-document.interface';
import { SocialType } from '@Users/enums/social-type.enum';
import { TokenService } from '@Users/services/user-token.service';
import { LoginOutput } from '@Users/interfaces/login-output.interface';
import { UserTokenPayload } from '@Users/interfaces/user-payload.interface';
import { UserErrors } from '@Users/enums/user-errors.enum';
import { LoginDto } from '@Users/dto/login.dto';
import { RegisterDto } from '@Users/dto/register.dto';
import { UserTokenTypes } from '@Users/enums/user-token-types.enum';
import { ChangePasswordDto } from '@Users/dto/change-password.dto';
import { ModifyProfileDto } from '@Users/dto/modify-profile.dto';
import { RecoverPasswordDto } from '@Users/dto/recover-password.dto';

@Injectable()
export class UsersService {
	/**
	 * Dependency injection.
	 * @param userModel Users mongoose entity
	 * @param configService Config service
	 * @param jwtService JWT service
	 * @param tokenService UserTokenService
	 * @param mailService MailService
	 */
	constructor(
		@InjectModel(UserModels.USER)
		private readonly userModel: Model<IUserModel>,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService
	) { }

	/**
	 * SALT for password hash
	 */
	private readonly HASH_SALT = 10;


	//#region Find

	/**
 * Finds all existing users (with pagination).
 * @param offset Number of elements to skip
 * @param limit Number of elements to return
 * @returns Users array paginated
 */
	async findPaginate(
		offset: number = 0,
		limit: number = 10
	): Promise<IPaginate<IUserDoc>> {
		return {
			data: (await this.userModel
				.find()
				.skip(offset)
				.limit(limit)
				.exec()) as IUserDoc[],
			limit,
			offset,
			total: await this.userModel.countDocuments().exec(),
		};
	}

	/**
 * Finds a user by email.
 * @param email User email
 */
	findByEmail(email: string): Promise<IUserDoc> {
		return this.userModel
			.findOne({
				email: email.toLowerCase(),
			})
			.exec() as Promise<IUserDoc>;
	}

	/**
	 * Finds a user by id.
	 * @param userId User ObjectId
	 * @returns User data
	 */
	findById(userId: ObjectID): Promise<IUserDoc> {
		return this.userModel.findById(userId).exec() as Promise<IUserDoc>;
	}

	/**
	 * Finds a user by social id.
	 * @param socialId User social id
	 * @param type Social type (Github, Gitlab...)
	 * @returns User data
	 */
	findBySocialAccount(
		socialId: string,
		type: SocialType
	): Promise<IUserDoc> {
		return this.userModel
			.findOne({ 'socialAccounts.id': socialId, 'socialAccounts.type': type })
			.exec() as Promise<IUserDoc>;
	}

	//#endregion


	//#region Social

	/**
		 * User social sign in.
		 * @param input.socialAccount Social account data
		 * @param input.socialAccount Social account data
		 * @returns JWT token and user data
		 */
	async socialLogin({
		socialAccount,
		userData,
	}: {
		socialAccount: ISocialAccount;
		userData: IUser;
	}): Promise<LoginOutput> {
		let user = await this.findBySocialAccount(
			socialAccount.id,
			socialAccount.type
		);

		if (!user) {
			user = await this.findByEmail(userData.email);

			if (!user) {
				user = (await this.userModel.create({
					...userData,
					socialAccounts: [socialAccount],
				})) as IUserDoc;
			} else {
				user.socialAccounts.push(socialAccount);
				await user.save();
			}
		}

		const payload: UserTokenPayload = {
			id: user._id.toString(),
			type: JwtStrategies.USER,
		};

		const token = await this.jwtService.signAsync(payload, {
			expiresIn: this.configService.get(Env.USER_TOKEN_EXPIRATION),
		});

		return {
			token,
			user: {
				_id: user.id,
				...user.toJSON(),
				isSocialLogin: !user.password,
			},
		};
	}

	/**
	 * Links a social account to an user.
	 * @param socialAccount Social account data
	 * @param userToLink User data
	 */
	async linkSocialProfile(
		socialAccount: ISocialAccount,
		userToLink: IUserDoc
	): Promise<void> {
		let userLinked = await this.findBySocialAccount(
			socialAccount.id,
			socialAccount.type
		);

		if (!userLinked) {
			userToLink.socialAccounts.push(socialAccount);
			await userToLink.save();
		} else {
			throw new ConflictException(UserErrors.SOCIAL_IN_USE);
		}
	}


	/**
	 *	Unlink a social account to an user.
	 * @param socialAccount Social account data
	 * @param userToLink User data
	 */
	async unlinkSocialProfile(
		socialAccount: ISocialAccount,
		userToUnlink: IUserDoc
	): Promise<void> {
		const index = userToUnlink.socialAccounts.findIndex(
			account =>
				account.id === socialAccount.id && account.type === socialAccount.type
		);

		if (index !== -1) {
			userToUnlink.socialAccounts.splice(index, 1);
			await userToUnlink.save();
		} else throw new NotFoundException(UserErrors.SOCIAL_NOT_FOUND);
	}

	//#endregion

	//#region User

	/**
	 * User login.
	 * @param input.email User email
	 * @param input.password User password
	 * @returns JWT token and user data
	 */
	async login({ email, password }: LoginDto): Promise<LoginOutput> {
		const user = await this.findByEmail(email);
		if (!user) throw new UnauthorizedException(UserErrors.INVALID_LOGIN);

		const checkPass = await compare(password, user.password);
		if (!checkPass)
			throw new UnauthorizedException(UserErrors.INVALID_LOGIN);

		if (!user.active)
			throw new UnauthorizedException(UserErrors.NOT_ACTIVATED);

		const payload: UserTokenPayload = {
			id: user._id.toString(),
			type: JwtStrategies.USER,
		};

		const token = await this.jwtService.signAsync(payload, {
			expiresIn: this.configService.get(Env.USER_TOKEN_EXPIRATION),
		});

		return {
			token,
			user: {
				_id: user.id,
				...user.toJSON(),
				isSocialLogin: !user.password,
			},
		};
	}


	/**
	 * Registers a new user.
	 * @param input.email User email
	 * @param input.name User name
	 * @param input.surname User surname
	 * @param input.password User password
	 */
	async register({
		email,
		name,
		surname,
		username,
		alias,
		password,
	}: RegisterDto): Promise<void> {
		const existUser = await this.findByEmail(email);
		if (existUser) throw new ConflictException(UserErrors.EMAIL_IN_USE);

		const dbSession = await this.userModel.db.startSession();
		await dbSession.withTransaction(async session => {
			const hashedPassword = await hash(password, this.HASH_SALT);
			const defaultAlias = `@${name}`

			const user = (
				await this.userModel.create(
					[
						{
							email: email.toLowerCase(),
							name: name,
							alias: !alias ? defaultAlias : alias,
							surname: surname,
							username: username,
							password: hashedPassword,
							active: false,
							socialAccounts: [],
						},
					],
					{ session }
				)
			)[0];

			const token = await this.tokenService.generateToken(
				user._id.toString(),
				UserTokenTypes.ACTIVATE_TOKEN,
				session
			);

			await this.mailService.sendActivationMail(email, name, token);
		});

		dbSession.endSession();
	}


	/**
	 * Changes user password.
	 * @param user User data
	 * @param input.oldPassword Old user password
	 * @param input.newPassword New user password
	 */
	async changePassword(
		user: IUserDoc,
		{ oldPassword, newPassword }: ChangePasswordDto
	): Promise<void> {
		if (!oldPassword) {
			if (user.password)
				throw new BadRequestException(UserErrors.FORMAT_OLD_PASSWORD);
		} else {
			const checkOldPass = await compare(oldPassword, user.password);
			if (!checkOldPass)
				throw new BadRequestException(UserErrors.FORMAT_OLD_PASSWORD);
		}

		user.password = await hash(newPassword, this.HASH_SALT);
		await user.save();
	}


	/**
	 * Changes user email.
	 * @param user User data
	 * @param newEmail New user email
	 * @returns New user email
	 */
	async changeEmail(user: IUserDoc, newEmail: string): Promise<string> {
		user.email = newEmail;
		await user.save();
		return newEmail;
	}


	/**
	 * Changes user username.
	 * @param user User data
	 * @param newUsername New user username
	 * @returns New user username
	 */
	async changeUsername(
		user: IUserDoc,
		newUsername: string
	): Promise<string> {
		user.username = newUsername;
		await user.save();
		return newUsername;
	}


	/**
	 * Modifies user profile data.
	 * @param user User data
	 * @param input New user data
	 */
	async modifyProfile(
		user: IUserDoc,
		newData: ModifyProfileDto
	): Promise<IUserDoc> {
		return await user.set({ ...newData }).save();
	}


	/**
	 * Sets a new user photo.
	 * @param user User data
	 * @param filename Image path
	 * @returns New user photo path
	 */
	async setPhoto(user: IUserDoc, filename: string): Promise<string> {
		if (user.photo)
			await fspromises
				.unlink(
					resolve(
						FOLDER_UPLOADS_USERS,
						user.photo.replace(
							this.configService.get(Env.SELF_DOMAIN) +
							this.configService.get(Env.UPLOADS_STATICS_PATH_USERS) +
							'/',
							''
						)
					)
				)
				.catch(error => Logger.error(error));
		user.photo =
			this.configService.get(Env.SELF_DOMAIN) +
			this.configService.get(Env.UPLOADS_STATICS_PATH_USERS) +
			'/' +
			filename;
		await user.save();
		return user.photo;
	}

	//#endregion

	//#region Activate and recover

	/**
	 * Creates a new forgot password token and send it by email.
	 * @param email User email
	 */
	async createForgotPasswordToken(email: string): Promise<void> {
		const user = await this.findByEmail(email);
		if (!user) throw new NotFoundException(UserErrors.EMAIL_NOT_FOUND);

		const token = await this.tokenService.generateToken(
			user._id.toString(),
			UserTokenTypes.RECOVER_TOKEN
		);

		await this.mailService.sendForgotPasswordMail(
			user.email,
			user.name,
			token
		);
	}

	/**
	 * Changes user password from a forgot password token.
	 * @param input.token Forgot password token
	 * @param input.newPassword New user password
	 */
	async changeForgotPassword({
		token,
		newPassword,
	}: RecoverPasswordDto): Promise<void> {
		const setNewPassword = async (session: ClientSession) => {
			const payload: UserTokenPayload = await this.tokenService.checkToken(
				token
			);

			const user = await this.findById(payload.id);
			if (!user) throw new NotFoundException(UserErrors.EMAIL_NOT_FOUND);

			user.password = await hash(newPassword, this.HASH_SALT);

			await this.tokenService.removeToken(token, session);
			await user.save({ session });
		};

		const dbSession = await this.userModel.db.startSession();
		await dbSession.withTransaction(() => setNewPassword(dbSession));

		dbSession.endSession();
	}

	/**
	 * Activates user account from an activation token.
	 * @param token Activation token
	 */
	async activateAccount(token: string): Promise<void> {
		const activateNewAccount = async (session: ClientSession) => {
			const payload: UserTokenPayload = await this.tokenService.checkToken(
				token
			);

			const user = await this.findById(payload.id);
			if (!user) throw new NotFoundException(UserErrors.EMAIL_NOT_FOUND);

			user.active = true;

			await this.tokenService.removeToken(token, session);
			await user.save({ session });
		};

		const dbSession = await this.userModel.db.startSession();
		await dbSession.withTransaction(() => activateNewAccount(dbSession));

		dbSession.endSession();
	}

	//#endregion




}


