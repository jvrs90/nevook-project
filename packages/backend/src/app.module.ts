import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from '@Common/errors/http-error.filter';
import { LoggingInterceptor } from '@Common/interceptor/logging.interceptor';

import { MailModule } from '@Common/modules/mail.module';
import { DatabaseModule } from '@Common/modules/database.module';
import { GraphqlModule } from '@Common/modules/graphql.module';
import { StaticsModule } from '@Common/modules/statics.module';
import { UsersModule } from '@Users/user.module';
import { DateScalar } from '@Common/scalars/date.scalar';



@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseModule,
		GraphqlModule,
		UsersModule,
		MailModule,
		StaticsModule,
	],
	providers: [
		DateScalar,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
	],
})
export class AppModule { }
