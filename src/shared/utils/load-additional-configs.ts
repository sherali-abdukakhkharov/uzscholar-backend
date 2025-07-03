import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { addSwagger } from './add-swagger';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.tz.setDefault('Asia/Tashkent');

export function loadAdditionalConfigsForSetup(app: NestExpressApplication) {
	const configService = app.get<ConfigService>(ConfigService);
	const port = configService?.get('HTTP_PORT') || 3039;
	const mode_env = configService?.get('MODE_ENV');

	app.use(bodyParser.json({ limit: '50mb' }));
	app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

	const corsOptions = !mode_env ? {} : { origin: '*' };
	app.enableCors(corsOptions);

	app.disable('etag');
	app.disable('x-powered-by');
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);

	app.setGlobalPrefix('api');

	const { swagger_url } = addSwagger(app);

	return { port, swagger_url };
}
