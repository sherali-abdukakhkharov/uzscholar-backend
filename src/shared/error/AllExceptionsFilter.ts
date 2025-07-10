/* eslint-disable no-console */
import { ArgumentsHost, Catch, HttpException, HttpServer, HttpStatus, Inject } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { ErrorLog } from '@shared/error/error-log';
import { isJson } from '@shared/utils';
import { ConfigService } from '@nestjs/config';

@Catch()
export class GlobalExceptionHandler extends BaseExceptionFilter {
	@Inject() private readonly configService: ConfigService;
	constructor(applicationRef: HttpServer) {
		super(applicationRef);
	}

	async catch(exception: any, host: ArgumentsHost) {
		if (typeof exception === 'string') {
			try {
				exception = JSON.parse(exception);
			} catch (e) {}
		}
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const isHttpException = exception instanceof HttpException;
		const exceptionData: any = isHttpException ? exception?.getResponse() : exception;
		// eslint-disable-next-line no-console

		const ClientRequest = ctx.getRequest<Request>();
		const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const errorLog: any = new ErrorLog(
			exceptionData,
			status,
			ClientRequest.url,
			ClientRequest,
			ClientRequest.user,
			this.configService,
		);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { tags, ...error } = errorLog;

		console.log(`exception::`, ClientRequest.url, ClientRequest.body, exceptionData, error);

		for (const key in error) {
			error[key] = error && error[key] && isJson(error[key]) ? JSON.parse(error[key]) : undefined;
		}

		return response.status(status).json({
			error,
			errorId: error?.errorId,
			response: { code: error?.response?.code },
		});
	}
}
