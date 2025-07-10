import { Inject, Injectable } from '@nestjs/common';
import { DissertationRepo } from './dissertation.repo';
import { GetAllDissertationsDto } from './dtos/get-all.dto';
import { krillToLatin, latinToKrill } from '@shared/utils/translate';

@Injectable()
export class DissertationService {
	@Inject() private readonly dissertationRepo: DissertationRepo;

	async getAll(body: GetAllDissertationsDto) {
		const { data, total } = await this.dissertationRepo.getAll(body);

		return { success: true, data, total };
	}

	async getOneById(id: string) {
		const data = await this.dissertationRepo.getOneById(id);

		return { success: true, data: data || null };
	}
}
