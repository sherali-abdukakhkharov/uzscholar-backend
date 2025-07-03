import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { loadAdditionalConfigsForSetup } from '@shared/utils/load-additional-configs';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
	});

	const { port, swagger_url } = loadAdditionalConfigsForSetup(app);

	await app.init();

	app.enableShutdownHooks();

	await app.listen(port, () => {
		console.log('edo listening on port: ', port);
		console.log('Swagger run at: ', `\x1b[33m http://localhost:${port}/${swagger_url}\x1b[39m`);
	});
}

bootstrap();
