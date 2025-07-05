import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base.repo';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryRepo extends BaseRepo<CategoryEntity> {
	tableName = 'categories';
}
