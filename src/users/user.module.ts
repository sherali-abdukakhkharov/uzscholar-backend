import { Module } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { UserService } from './user.service';

@Module({
	providers: [UserRepo, UserService],
	exports: [UserService],
})
export class UserModule {}
