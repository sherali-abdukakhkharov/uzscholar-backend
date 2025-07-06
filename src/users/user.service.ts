import { Inject, Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { IBaseSelectOptions } from '@shared/interfaces/base-repo.interface';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
	@Inject() private readonly userRepo: UserRepo;

	selectByUsername(username: string, columns: IBaseSelectOptions<UserEntity>['columns'] = ['*']) {
		return this.userRepo.selectOne(
			{
				username,
				is_deleted: false,
			},
			columns,
		);
	}
}
