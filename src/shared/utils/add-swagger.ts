import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

export function addSwagger(app: NestExpressApplication) {
	const SwaggerDocName = 'api-swagger';
	app.use(
		['/' + SwaggerDocName],
		expressBasicAuth({
			challenge: true,
			users: {
				admin: '1111',
			},
		}),
	);

	const options = new DocumentBuilder()
		.setTitle('api documentation')
		.setVersion('1.0')
		.addTag('auth')
		.addBearerAuth(
			{
				name: 'authorization',
				type: 'apiKey',
				in: 'header',
			},
			'authorization',
		)
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup(SwaggerDocName, app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	return { swagger_url: SwaggerDocName };
}
