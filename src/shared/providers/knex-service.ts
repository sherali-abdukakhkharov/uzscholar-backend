import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { InjectConnection, KnexModuleOptions } from 'nestjs-knex';

@Injectable()
export class KnexService {
	constructor(
		@InjectConnection('master') readonly knex: Knex,
		@InjectConnection('slave') readonly knexRead: Knex,
	) {}
}

export function masterKnexConfigUseFactory(
	configService: ConfigService,
): KnexModuleOptions | Promise<KnexModuleOptions> {
	return {
		config: {
			client: 'postgresql',
			debug: false,
			connection: {
				host: configService.getOrThrow<string>('PGHOST'),
				user: configService.get<string>('PGUSER'),
				database: configService.get<string>('PGDATABASE'),
				password: configService.get<string>('PGPASSWORD'),
				port: Number(configService.get<string>('PGPORT')),
				application_name: `new adm edo ${new Date().getTime()}`,
			},
			pool: {
				min: 0,
				max: Number(configService.get<string>('MAX_POOL')) || 75,
			},
		},
	};
}

export function slaveKnexConfigUseFactory(
	configService: ConfigService,
): KnexModuleOptions | Promise<KnexModuleOptions> {
	return {
		config: {
			client: 'postgresql',
			debug: false,
			connection: {
				host: configService.get<string>('READ_PGHOST'),
				user: configService.get<string>('PGUSER'),
				database: configService.get<string>('PGDATABASE'),
				password: configService.get<string>('PGPASSWORD'),
				port: Number(configService.get<string>('READ_PGPORT')),
				application_name: `new adm edo ${new Date().getTime()}`,
				query_timeout: 50000,
			},
			pool: {
				min: 0,
				max: Number(configService.get<string>('MAX_POOL')) || 75,
			},
		},
	};
}
