import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	first_name: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	last_name: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	middle_name?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	email?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	password: string;
}
