import { Body, Controller, Post } from '@nestjs/common';
import { GetAllDissertationsDto } from './dtos/get-all.dto';
import { ApiBody } from '@nestjs/swagger';
import { DissertationService } from './dissertation.service';

@Controller('dissertations')
export class DissertationController {
	constructor(private readonly dissertationService: DissertationService) {}

	@ApiBody({
		type: GetAllDissertationsDto,
		description: 'Get all dissertations',
	})
	@Post('get-all')
	async getAll(@Body() body: GetAllDissertationsDto) {
		return this.dissertationService.getAll(body);
	}
}
