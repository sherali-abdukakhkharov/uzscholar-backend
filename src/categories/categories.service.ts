import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepo } from './categories.repo';
import { GetAllCategoriesDto } from './dto/get-all.dto';

@Injectable()
export class CategoryService {
	@Inject() private readonly categoryRepo: CategoryRepo;

	async findAll(body: GetAllCategoriesDto) {
		const query = this.categoryRepo.select(
			{
				is_deleted: false,
				parent_id: body.parent_id ? body.parent_id : null,
			},
			{
				columns: ['id', 'name'],
			},
		);

		const totalQuery = query
			.clone()
			.clearSelect()
			.clearOrder()
			.clearGroup()
			.select(this.categoryRepo.knexRead.raw(`count(*) as total`));

		const [data, totalResult] = await Promise.all([query, totalQuery.first<{ total: string }>()]);

		return { success: true, data, total: Number(totalResult?.total) || 0 };
	}
}
