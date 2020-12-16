import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Env } from '@Common/enums/env.enum';

/**
 * Service to handle mailing
 */
@Injectable()
export class MailService {
	/**
	 * @ignore
	 */
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	/**
	 * Method to send activation email
	 *
	 * @param  {string} email
	 * @param  {string} name
	 * @param  {string} token
	 * @returns Promise
	 */
	async sendActivationMail(
		email: string,
		name: string,
		token: string
	): Promise<boolean> {
		if (this.configService.get(Env.NODE_ENV) === 'test') return true;

		const activationLink = `${this.configService.get(
			Env.HOST_FRONT
		)}/activate/${token}`;

		await this.mailerService.sendMail({
			to: email,
			from: '"NoReply Nevook " <noreply@nevook.com>',
			subject: 'Nevook - Activa tu cuenta',
			template: 'activate',
			text: `Activa tu cuenta en Nevook a través del siguiente enlace ${activationLink}`,
			context: {
				user_firstname: name,
				confirm_link: activationLink,
			},
		});

		return true;
	}

	/**
	 * Method to send new password email
	 *
	 * @param  {string} email
	 * @param  {string} name
	 * @param  {string} token
	 * @returns Promise
	 */
	async sendForgotPasswordMail(
		email: string,
		name: string,
		token: string
	): Promise<boolean> {
		if (this.configService.get(Env.NODE_ENV) === 'test') return true;

		const recoverLink = `${this.configService.get(
			Env.HOST_FRONT
		)}/recover/${token}`;

		await this.mailerService.sendMail({
			to: email,
			from: '"NoReply Nevook " <noreply@nevook.com>',
			subject: 'Nevook - Recupera tu contraseña',
			template: 'recover',
			text: `Recupera tu contraseña en Nevook a través del siguiente enlace ${recoverLink}`,
			context: {
				user_firstname: name,
				recover_link: recoverLink,
			},
		});

		return true;
	}
}
