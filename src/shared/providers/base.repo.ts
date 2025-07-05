import { Injectable } from '@nestjs/common';
import { AddKnexRaw, IBaseSelectOptions, IBaseTable } from '@shared/interfaces/base-repo.interface';
import ObjectID from 'bson-objectid';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';
import { InjectConnection } from 'nestjs-knex';

@Injectable()
export abstract class BaseRepo<ITable extends Pick<IBaseTable, 'id'>> {
	abstract tableName: string;

	@InjectConnection('master') readonly knex: Knex;
	@InjectConnection('slave') readonly knexRead: Knex;

	select<IResponse>(
		where: Partial<ITable>,
		options: IBaseSelectOptions<ITable> = {},
		trx?: Knex.Transaction,
	): Knex.QueryBuilder<null, IResponse extends Array<infer U> ? U[] : IResponse> {
		const { limit = 20, offset = 0, columns = ['*'] } = options;
		const knex = trx ? trx : this.knexRead;
		const query: Knex.QueryBuilder = knex.select(columns).from(this.tableName).where(where);

		if (limit) {
			query.limit(Number(limit));
		}

		if (offset) {
			query.offset(Number(offset));
		}

		return query;
	}

	selectOne<IResponse>(
		where: Partial<ITable>,
		columns: IBaseSelectOptions<ITable>['columns'] = ['*'],
		trx?: Knex.Transaction,
	): Knex.QueryBuilder<null, IResponse> {
		const knex = trx ? trx : this.knexRead;
		const query: Knex.QueryBuilder = knex.select(columns).from(this.tableName).where(where).first();

		return query;
	}

	update<IResponse>(
		where: Partial<AddKnexRaw<ITable>>,
		value: Partial<AddKnexRaw<ITable>>,
		trx?: Knex.Transaction,
		returnColumns?: Knex.Raw[] | (keyof ITable)[] | ['*'],
	): Knex.QueryBuilder<null, IResponse[]> {
		const knex = trx ? trx : this.knex;
		const query: Knex.QueryBuilder = knex.update(value).where(where).from(this.tableName);

		if (!isEmpty(returnColumns)) {
			query.returning(returnColumns as Knex.Raw[]);
		}

		return query;
	}

	insert<IResponse>(
		value: AddKnexRaw<ITable> | AddKnexRaw<ITable>[],
		trx?: Knex.Transaction,
		returnColumns?: Knex.Raw[] | (keyof ITable)[] | ['*'],
		onConflict?: (keyof ITable)[],
		mergeColumns?: (keyof ITable)[],
	): Knex.QueryBuilder<null, IResponse[]> {
		const knex = trx ? trx : this.knex;
		const query: Knex.QueryBuilder = knex.insert(value).into(this.tableName);

		if (!isEmpty(returnColumns)) {
			query.returning(returnColumns as Knex.Raw[]);
		}

		if (!isEmpty(onConflict) && !isEmpty(mergeColumns)) {
			query.onConflict(onConflict as unknown as Knex.Raw).merge(mergeColumns);
		}

		if (!isEmpty(onConflict) && isEmpty(mergeColumns)) {
			query.onConflict(onConflict as unknown as Knex.Raw).ignore();
		}

		return query;
	}

	generateRecordId() {
		return new ObjectID().toString();
	}

	getById<IResponse>(
		id: string,
		trx?: Knex.Transaction,
		columns: IBaseSelectOptions<ITable>['columns'] = ['*'],
	): Knex.QueryBuilder<null, IResponse> {
		const knex = trx ? trx : this.knexRead;
		const query: Knex.QueryBuilder = knex.select(columns).from(this.tableName).where({ id }).first();
		return query;
	}

	batchInsert<IResponse>(
		data: ITable[],
		chunkSize: number,
		trx?: Knex.Transaction,
		returnAllColumns?: boolean,
	): Knex.BatchInsertBuilder<null, IResponse[]> {
		const knex = trx ?? this.knex;
		const query: Knex.BatchInsertBuilder<null, any> = knex.batchInsert(this.tableName, data as any, chunkSize);

		if (returnAllColumns) {
			query.returning('*');
		}

		return query;
	}
}
