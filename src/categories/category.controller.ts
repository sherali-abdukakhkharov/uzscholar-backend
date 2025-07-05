import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { ApiBody } from '@nestjs/swagger';
import { GetAllCategoriesDto } from './dto/get-all.dto';

@Controller('category')
export class CategoryController {
	@Inject() private readonly categoryService: CategoryService;

	@Post('get-all')
	@ApiBody({
		type: GetAllCategoriesDto,
		description: 'get all categories',
	})
	findAll(@Body() body: GetAllCategoriesDto) {
		return this.categoryService.findAll(body);
	}
}
