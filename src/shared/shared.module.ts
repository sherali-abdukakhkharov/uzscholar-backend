import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { KnexService } from './providers/knex-service';

@Global()
@Module({
	providers: [KnexService],
	imports: [JwtModule.register({})],
	exports: [JwtModule, KnexService],
})
export class SharedModule {}
