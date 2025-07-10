import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetOneDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	id: string;
}
