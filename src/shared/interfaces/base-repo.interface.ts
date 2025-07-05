import { Knex } from 'knex';

export interface IBaseSelectOptions<ITable> {
	limit?: number;
	offset?: number;
	columns?: (Knex.Raw | keyof ITable)[] | ['*'];
}

export interface IBaseTable {
	id: string;
	db_id: string;
	created_at?: Date;
	created_by: string;
	is_deleted?: boolean;
	deleted_at?: Date;
	deleted_by?: string;
}

export type AddKnexRaw<T> = {
	[K in keyof T]: T[K] | Knex.Raw;
};

export type WithTotal<T> = T & { total: number };
