import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Env } from '@Common/enums/env.enum';
import { join } from 'path';

/**
 * Mailer module configuarion with env
 */
export const MailModule = MailerModule.forRootAsync({
	useFactory: (configService: ConfigService): MailerModule => ({
		transport: {
			host: configService.get(Env.MAIL_HOST),
			port: Number(configService.get(Env.MAIL_PORT)),
			ignoreTLS: Boolean(configService.get(Env.MAIL_TLS)),
		},
		defaults: {
			from: '"NoReply Nevook " <noreply@nevook.com>',
		},
		template: {
			dir: join(__dirname, '../../../templates'),
			adapter: new EjsAdapter(),
			options: {
				strict: true,
			},
		},
	}),
	inject: [ConfigService],
});
