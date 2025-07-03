import { Module } from '@nestjs/common';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nestjs-knex';
import { masterKnexConfigUseFactory, slaveKnexConfigUseFactory } from '@shared/providers/knex-service';
import { GlobalExceptionHandler } from '@shared/error/AllExceptionsFilter';
import { SharedModule } from '@shared/shared.module';
@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: ['/app/.env', '.env'], isGlobal: true }),
		KnexModule.forRootAsync(
			{
				imports: [ConfigModule],
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => masterKnexConfigUseFactory(configService),
			},
			'master',
		),
		KnexModule.forRootAsync(
			{
				imports: [ConfigModule],
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => slaveKnexConfigUseFactory(configService),
			},
			'slave',
		),
		SharedModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useFactory: (httpAdapterHost: HttpAdapterHost) => {
				return new GlobalExceptionHandler(httpAdapterHost.httpAdapter);
			},
			inject: [HttpAdapterHost],
		},
	],
})
export class AppModule {}
