import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAllDissertationsDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	category_id?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	sub_category_id?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	search_text?: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	limit: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	offset: number;
}
