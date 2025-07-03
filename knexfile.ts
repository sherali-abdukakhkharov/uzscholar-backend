import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';

if (existsSync('/app/.env')) {
	const envLoad = dotenv.config({ path: '/app/.env' });
	if (envLoad.error) {
		throw envLoad.error;
	}
} else {
	const envLoad = dotenv.config();
	if (envLoad.error) {
		throw envLoad.error;
	}
}

const config: { [key: string]: Knex.Config } = {
	development: {
		client: 'pg',
		connection: {
			host: process.env.PGHOST,
			user: process.env.PGUSER,
			password: process.env.PGPASSWORD,
			port: Number(process.env.PGPORT),
			database: process.env.PGDATABASE,
		},
		migrations: {
			directory: './migrations',
			extension: 'ts',
		},
		seeds: {
			directory: './seeds',
		},
	},
	production: {
		client: 'pg',
		connection: {
			host: process.env.PGHOST,
			user: process.env.PGUSER,
			password: process.env.PGPASSWORD,
			port: Number(process.env.PGPORT),
			database: process.env.PGDATABASE,
		},
		migrations: {
			directory: './migrations',
			extension: 'ts',
		},
		seeds: {
			directory: './seeds',
		},
	},
};

export default config;
