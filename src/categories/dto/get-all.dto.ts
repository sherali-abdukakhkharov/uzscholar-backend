import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class GetAllCategoriesDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@Length(24, 24, { message: 'parent_id should be valid ObjectId' })
	parent_id: string;
}
