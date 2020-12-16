import { UserErrors } from '@Users/enums/user-errors.enum';
import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { Response } from 'express';
import { Error as MongoError } from 'mongoose';
import { TimeoutError } from 'rxjs';

/**
 * Class for catch all excaptions producced while respond incoming request
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	/**
	 * Error delegate function
	 *
	 * @param  {HttpException|MongoError|TimeoutError|Error} exception
	 * @param  {ArgumentsHost} host
	 */
	catch(
		exception:
			| HttpException
			| MongoError
			| TimeoutError
			| Error
			| MongoError.ValidationError,
		host: ArgumentsHost
	) {
		const type = host.getType<GqlContextType>();

		if (type === 'graphql') {
			if (exception instanceof MongoError.ValidationError) {
				throw new BadRequestException();
			} else if (
				(exception instanceof MongoError ||
					exception instanceof TimeoutError ||
					exception instanceof Error) &&
				!(exception instanceof HttpException)
			) {
				//TODO Logging
				//const gqlHost = GqlArgumentsHost.create(host);
				Logger.error(exception, exception.stack, 'Error Filter');
				throw new InternalServerErrorException(UserErrors.SERVER);
			}
		} else if (type === 'http') {
			const ctx = host.switchToHttp();
			const response = ctx.getResponse<Response>();
			if (exception instanceof HttpException) {
				let statusCode = exception.getStatus();
				const r = <any>exception.getResponse();
				response.status(statusCode).json(r);
			} else if (exception['code'] === 'ENOENT') {
				response.status(HttpStatus.NOT_FOUND).json();
			} else {
				Logger.error(exception, exception.stack, 'Error Filter');
				response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
					message: UserErrors.SERVER,
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				});
			}
		}
	}
}
