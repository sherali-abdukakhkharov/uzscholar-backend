import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base.repo';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepo extends BaseRepo<UserEntity> {
	tableName = 'users';
}
