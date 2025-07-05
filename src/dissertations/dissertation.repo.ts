import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base.repo';
import { DissertationEntity } from './entities/dissertation.entity';

@Injectable()
export class DissertationRepo extends BaseRepo<DissertationEntity> {
	tableName = 'dissertations';
}
