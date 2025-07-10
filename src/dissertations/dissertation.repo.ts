import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base.repo';
import { DissertationEntity } from './entities/dissertation.entity';

@Injectable()
export class DissertationRepo extends BaseRepo<DissertationEntity> {
	tableName = 'dissertations';

	getOneById(id: string) {
		const knex = this.knexRead;

		const query = knex
			.select([
				'id',
				'created_at',
				'created_by_name',
				'code',
				'language_code',
				'title',
				'created_year',
				'year',
				'description',
				'pages',
				'preview_files',
			])
			.from(this.tableName)
			.where({ id })
			.andWhere('is_deleted', false)
			.first();

		return query;
	}
}
