import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base.repo';
import { DissertationEntity } from './entities/dissertation.entity';
import { GetAllDissertationsDto } from './dtos/get-all.dto';
import { krillToLatin, latinToKrill } from '@shared/utils/translate';

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

	async getAll(body: GetAllDissertationsDto) {
		const { category_id, sub_category_id, search_text, limit = 20, offset = 0 } = body;

		const knex = this.knexRead;
		const query = knex
			.select([['id', 'created_by_name', 'created_at', 'description', 'language_code', 'pages', 'title', 'year']])
			.from(this.tableName)
			.where('is_deleted', false)
			.orderBy('id', 'desc');

		if (category_id) {
			query.where({ category_id });
		}

		if (sub_category_id) {
			query.where({ sub_category_id });
		}

		if (search_text) {
			const searchArr = search_text.trim().split(` `) || [];
			for (const search of searchArr) {
				const name_latin = krillToLatin(search).replace(/'/g, "''");
				const name_krill = latinToKrill(search);
				query.andWhere((builder) =>
					builder
						.orWhere('title', `ilike`, knex.raw(`concat('%', ?::text, '%')`, [name_latin]))
						.orWhere('title', `ilike`, knex.raw(`concat('%', ?::text, '%')`, [name_krill])),
				);
			}
		}

		const totalQuery = query.clone().clearSelect().clearOrder().clearGroup().select(knex.raw(`count(*) as total`));

		query.limit(limit).offset(offset);

		const [data, totalResult] = await Promise.all([query, totalQuery.first<{ total: string }>()]);

		return { data, total: Number(totalResult?.total) || 0 };
	}
}
