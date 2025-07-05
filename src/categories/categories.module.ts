import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './categories.service';
import { CategoryRepo } from './categories.repo';

@Module({
	controllers: [CategoryController],
	providers: [CategoryService, CategoryRepo],
	exports: [CategoryService],
})
export class CategoryModule {}
