import { Module } from '@nestjs/common';
import { DissertationService } from './dissertation.service';
import { DissertationRepo } from './dissertation.repo';
import { DissertationController } from './dissertation.controller';

@Module({
	controllers: [DissertationController],
	providers: [DissertationService, DissertationRepo],
	exports: [DissertationService],
})
export class DissertationModule {}
