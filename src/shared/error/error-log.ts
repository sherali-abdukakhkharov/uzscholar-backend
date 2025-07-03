import { HttpException } from '@nestjs/common/exceptions';
import { ERROR_PREFIX } from './error-codes';
import { isEmpty } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { generateRecordId } from '@shared/utils/generate-id';

export class ErrorLog extends HttpException {
	statusCode: number;
	timestamp: string;
	api: string;
	file: string;
	line: string;
	label: string;
	tags: any;
	request: { body: any; query: any; params: any };
	user: any;
	errorId: string;
	kubePod: string;

	constructor(
		exceptionData: any | Record<string, any>,
		status: number,
		requestUrl: string,
		request,
		user,
		configService: ConfigService,
	) {
		const exception = checkCode(exceptionData);
		super(exception, status);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { details, modules, roles, ...user_data } = user || {};
		this.statusCode = status;
		this.timestamp = new Date().toISOString();
		this.api = requestUrl;
		this.errorId = generateRecordId();
		this.kubePod = !configService?.get<string>('HOSTNAME') ? null : configService?.get<string>('HOSTNAME');
		this.label = 'EDO';
		this.line = exception.lineNumber;
		this.file = exception.fileName;
		this.tags = {
			db_id: user?.db_id,
			type: this.errorGroup(this.statusCode),
			api: this.api,
			errorId: this.errorId,
			kubePod: !configService?.get<string>('HOSTNAME') ? null : configService?.get<string>('HOSTNAME'),
			user_agent: request.headers['user-agent'],
			client: request.headers['sec-ch-ua-platform'],
			client_browser: request.headers['sec-ch-ua'],
			referer: request.headers['referer'],
			ip_address: request.headers['x-original-forwarded-for'] || request.connection.remoteAddress,
		};
		this.request = {
			body: request.body,
			params: JSON.stringify(request.params),
			query: JSON.stringify(request.query),
		};
		this.user = user_data;
	}

	errorGroup(status) {
		if (status >= 300 && status < 400) {
			return 'REDIRECTION';
		}
		if (status >= 400 && status < 500) {
			return 'CLIENT_ERROR';
		}
		if (status >= 500 && status < 600) {
			return 'SERVER_ERROR';
		}
	}
}

function checkCode(exceptionData) {
	let exception = exceptionData && exceptionData.response ? exceptionData.response : exceptionData;
	if (typeof exception === 'string' && isStringObj(exception)) {
		try {
			exception = JSON.parse(exception);
		} catch (e) {
			console.log(`error ===>`, e);
		}
	}
	const classValidatorError =
		exception &&
		typeof exception === 'object' &&
		exception.hasOwnProperty('message') &&
		Array.isArray(exception.message) &&
		exception.message[0]?.length === 5 &&
		typeof exception.message[0] === 'string'
			? exception.message[0].startsWith(ERROR_PREFIX)
			: false;
	if (classValidatorError) {
		return { message: exception, code: exception.message[0], line: exception.lineNumber, file: exception.fileName };
	}
	if (typeof exception === 'string') {
		return { message: exception, code: `${ERROR_PREFIX}000` };
	}
	const defaultException = !(exception && typeof exception === 'object' && exception.hasOwnProperty('code'));
	if (defaultException) {
		exception.code = `${ERROR_PREFIX}000`;
	}

	if (exception && typeof exception === 'object' && exception.exception && exception.exception.hasOwnProperty('code')) {
		exception.code = exception?.exception.code;
	}

	try {
		if (exception && typeof exception === 'object' && exception.hasOwnProperty('message')) {
			// const message = JSON.parse(exception);
			const message = exception.message;
			if (message && message.code) {
				return { message: exception, code: message.code, line: exception.lineNumber, file: exception.fileName };
			}
		}
	} catch (error) {
		console.log(`error ===>`, error);
	}

	return exception;
}

function isStringObj(str) {
	if (isEmpty(str)) {
		return false;
	}
	return (
		(str.includes('{', 0) && str.includes('}', str.length - 1)) ||
		(str.includes('[', 0) && str.includes(']', str.length - 1))
	);
}
