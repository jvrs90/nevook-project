import { GetGqlAuthUser } from '@Common/auth/get-user.decorator';
import { IPaginate, ObjectID } from '@Common/interfaces/mongoose.interface';
import { ObjectIDArrayPipe } from '@Common/pipes/objectid-array.pipe';
import { PaginateDto } from '@Common/types/paginate-filter.types';
import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserGqlAuthGuard } from '@Users/auth/user-gql-auth.guard';
import { ChangePasswordDto } from '@Users/dto/change-password.dto';
import { LoginDto } from '@Users/dto/login.dto';
import { ModifyProfileDto } from '@Users/dto/modify-profile.dto';
import { RecoverPasswordDto } from '@Users/dto/recover-password.dto';
import { RegisterDto } from '@Users/dto/register.dto';
import { SocialLoginDto } from '@Users/dto/social-login.dto';
import { SocialUnlinkDto } from '@Users/dto/social-unlink.dto';
import { LoginOutput } from '@Users/interfaces/login-output.interface';
import {
	ISocialAccount,
	IUser,
	IUserDoc,
} from '@Users/interfaces/user-document.interface';
import { ChangePasswordPipe } from '@Users/pipes/change-password.pipe';
import { EmailPipe } from '@Users/pipes/email.pipe';
import { LoginPipe } from '@Users/pipes/login.pipe';
import { ModifyProfilePipe } from '@Users/pipes/modify-profile.pipe';
import { RecoverPasswordPipe } from '@Users/pipes/recover-password.pipe';
import { RegisterPipe } from '@Users/pipes/register.pipe';
import { SocialLoginPipe } from '@Users/pipes/social-login.pipe';
import { TokenPipe } from '@Users/pipes/token.pipe';
import { UsernamePipe } from '@Users/pipes/username.pipe';
import { TokenService } from '@Users/services/user-token.service';
import { UsersService } from '@Users/services/users.service';
import { Login } from '@Users/types/login.type';
import {
	ProfileUser,
	User,
	UserPaginated,
} from '@Users/types/user.type';


/**
 * User graphql queries and resolvers.
 */
@Resolver(() => User)
export class UsersResolver {
	/**
	 * Dependency injection.
	 * @param userService User service
	 * @param tokenService User token service
	 */
	constructor(
		private readonly userService: UsersService,
		private readonly tokenService: TokenService
	) {}

	//#region Find

	/**
	 * Gets gurrent user.
	 *
	 * - AUTH: User
	 * @param user User data
	 */
	@Query(() => ProfileUser)
	@UseGuards(UserGqlAuthGuard)
	async user_profile(
		@GetGqlAuthUser() user: IUserDoc
	): Promise<ProfileUser> {
		return {
			_id: user.id,
			...user.toJSON(),
			isSocialLogin: !user.password,
		};
	}

	/**
	 * Finds all existing users (with pagination).
	 *
	 * - AUTH: Workers
	 * - ROLES: All
	 * @param paginate Pagination options
	 * @returns Users array paginated
	 */
	// @UseGuards(WorkerGqlAuthGuard)
	@Query(() => UserPaginated)
	user_find(
		@Args('paginate', { type: () => PaginateDto, nullable: true })
		paginate: PaginateDto
	): Promise<IPaginate<IUserDoc>> {
		return this.userService.findPaginate(
			(paginate && paginate.offset) || 0,
			(paginate && paginate.limit) || 10
		);
	}

	//#endregion

	//#region Users

	/**
	 * User login.
	 *
	 * - AUTH: Public
	 * @param input.email User email
	 * @param input.password User password
	 * @returns JWT token and user data
	 */
	@Query(() => Login)
	async user_login(
		@Args('input', { type: () => LoginDto }, LoginPipe)
		input: LoginDto
	): Promise<LoginOutput> {
		return this.userService.login(input);
	}

	/**
	 * Registers a new user.
	 *
	 * - AUTH: Public
	 * @param input New user data
	 * @returns True if success
	 */
	@Mutation(() => Boolean)
	async user_register(
		@Args('input', { type: () => RegisterDto }, RegisterPipe)
		input: RegisterDto
	): Promise<boolean> {
		await this.userService.register(input);
		return true;
	}

	/**
	 * Changes user password.
	 *
	 * - AUTH: User
	 * @param user User data
	 * @param input Old and new password
	 */
	@Mutation(() => Boolean)
	@UseGuards(UserGqlAuthGuard)
	async user_change_password(
		@GetGqlAuthUser() user: IUserDoc,
		@Args('input', { type: () => ChangePasswordDto }, ChangePasswordPipe)
		input: ChangePasswordDto
	): Promise<boolean> {
		await this.userService.changePassword(user, input);
		return true;
	}

	/**
	 * Changes user email.
	 *
	 * - AUTH: User
	 * @param user User data
	 * @param newEmail New user email
	 * @returns New user email
	 */
	@Mutation(() => String)
	@UseGuards(UserGqlAuthGuard)
	async user_change_email(
		@GetGqlAuthUser() user: IUserDoc,
		@Args('newEmail', EmailPipe) newEmail: string
	): Promise<string> {
		return this.userService.changeEmail(user, newEmail);
	}

	/**
	 * Changes user username.
	 *
	 * - AUTH: User
	 * @param user User data
	 * @param newUsername New user username
	 * @returns New user username
	 */
	@Mutation(() => String)
	@UseGuards(UserGqlAuthGuard)
	async user_change_username(
		@GetGqlAuthUser() user: IUserDoc,
		@Args('newUsername', UsernamePipe) newUsername: string
	): Promise<string> {
		return this.userService.changeUsername(user, newUsername);
	}

	/**
	 * Modifies user profile data.
	 *
	 * - AUTH: User
	 * @param user User data
	 * @param input New user data
	 * @returns True if success
	 */
	@Mutation(() => User)
	@UseGuards(UserGqlAuthGuard)
	async user_modify_profile(
		@GetGqlAuthUser() user: IUserDoc,
		@Args('input', { type: () => ModifyProfileDto }, ModifyProfilePipe)
		input: Partial<ModifyProfileDto>
	): Promise<IUserDoc> {
		return this.userService.modifyProfile(user, input);
	}

	//#endregion

	//#region Activate and recover

	/**
	 * Activates user account from an activation token.
	 *
	 * - AUTH: Public
	 * @param token Activation token
	 * @returns True if success
	 */
	@Mutation(() => Boolean)
	async user_activate_account(
		@Args('token', { type: () => ID }, TokenPipe) token: string
	): Promise<boolean> {
		await this.userService.activateAccount(token);
		return true;
	}

	/**
	 * Checks if a recover password token is valid.
	 *
	 * - AUTH: Public
	 * @param token Forgot password token
	 */
	@Query(() => Boolean)
	async user_valid_forgot_password_token(
		@Args('token', { type: () => ID }, TokenPipe) token: string
	): Promise<boolean> {
		await this.tokenService.checkToken(token);
		return true;
	}

	/**
	 * Creates a new forgot password token and send it by email.
	 *
	 * - AUTH: Public
	 * @param email User email
	 * @returns True if success
	 */
	@Mutation(() => Boolean)
	async user_create_forgot_password_token(
		@Args('email', EmailPipe) email: string
	): Promise<boolean> {
		await this.userService.createForgotPasswordToken(email);
		return true;
	}

	/**
	 * Changes user password from a forgot password token.
	 *
	 * - AUTH: Public
	 * @param input Recover password data
	 * @returns True if success
	 */
	@Mutation(() => Boolean)
	async user_change_forgot_password(
		@Args('input', { type: () => RecoverPasswordDto }, RecoverPasswordPipe)
		input: RecoverPasswordDto
	): Promise<boolean> {
		await this.userService.changeForgotPassword(input);
		return true;
	}

	//#endregion

	//#region Social

	/**
	 * User social login.
	 *
	 * - AUTH: Public
	 * @param input Social login data
	 * @returns JWT token and user data
	 */
	@Mutation(() => Login)
	async user_social_login(
		@Args('input', { type: () => SocialLoginDto }, SocialLoginPipe)
		input: {
			socialAccount: ISocialAccount;
			userData: IUser;
		}
	): Promise<LoginOutput> {
		return this.userService.socialLogin(input);
	}

	/**
	 * Links a social account to an user.
	 *
	 * - AUTH: User
	 * @param input Social account data
	 * @param user User data
	 */
	@Mutation(() => Boolean)
	@UseGuards(UserGqlAuthGuard)
	async user_link_social_profile(
		@Args('input', { type: () => SocialLoginDto }, SocialLoginPipe)
		input: { socialAccount: ISocialAccount; userData: IUser },
		@GetGqlAuthUser()
		user: IUserDoc
	): Promise<boolean> {
		await this.userService.linkSocialProfile(input.socialAccount, user);
		return true;
	}

	/**
	 *	Unlink a social account to an user.
	 *
	 * - AUTH: User
	 * @param input Social account data
	 * @param user User data
	 */
	@Mutation(() => Boolean)
	@UseGuards(UserGqlAuthGuard)
	async user_unlink_social_profile(
		@Args('input', { type: () => SocialUnlinkDto })
		input: ISocialAccount,
		@GetGqlAuthUser()
		user: IUserDoc
	): Promise<boolean> {
		await this.userService.unlinkSocialProfile(input, user);
		return true;
	}

	//#endregion

}
