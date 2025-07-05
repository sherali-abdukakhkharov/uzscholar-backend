import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepo } from './categories.repo';
import { GetAllCategoriesDto } from './dto/get-all.dto';

@Injectable()
export class CategoryService {
	@Inject() private readonly categoryRepo: CategoryRepo;

	async findAll(body: GetAllCategoriesDto) {
		const data = await this.categoryRepo.select(
			{
				is_deleted: false,
				parent_id: body.parent_id ? body.parent_id : null,
			},
			{
				columns: ['id', 'name'],
			},
		);

		return { success: true, data };
	}
}
