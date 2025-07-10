import { Inject, Injectable } from '@nestjs/common';
import { DissertationRepo } from './dissertation.repo';
import { GetAllDissertationsDto } from './dtos/get-all.dto';

@Injectable()
export class DissertationService {
	@Inject() private readonly dissertationRepo: DissertationRepo;

	async getAll(body: GetAllDissertationsDto) {
		const query = this.dissertationRepo.select(
			{
				is_deleted: false,
			},
			{
				limit: body.limit,
				offset: body.offset,
				columns: ['id', 'created_by_name', 'created_at', 'description', 'language_code', 'pages', 'title', 'year'],
			},
		);

		if (body.category_id) {
			query.where({ category_id: body.category_id });
		}

		if (body.sub_category_id) {
			query.where({ sub_category_id: body.sub_category_id });
		}

		const totalQuery = query
			.clone()
			.clearSelect()
			.clearOrder()
			.clearGroup()
			.select(this.dissertationRepo.knexRead.raw(`count(*) as total`));

		const [data, totalResult] = await Promise.all([query, totalQuery.first<{ total: string }>()]);

		return { success: true, data, total: Number(totalResult?.total) || 0 };
	}

	async getOneById(id: string) {
		const data = await this.dissertationRepo.getOneById(id);

		return { success: true, data: data || null };
	}
}
