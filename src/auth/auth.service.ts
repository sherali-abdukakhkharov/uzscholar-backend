import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { LoginByPasswordDto } from './dtos/login-by-password.dto';
import { isEmpty } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { generateRandomCode } from '@shared/utils';
import { ICurrentUser } from 'src/users/interfaces/current-user.interface';
import { SignUpDto } from './dtos/signup.dto';
import { generateRecordId } from '@shared/utils/generate-id';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	readonly AUTH_CLIENT_SECRET = this.configService.get<string>('CLIENT_SECRET');

	async loginByPassword(body: LoginByPasswordDto) {
		const { username, password } = body;

		const user = await this.userService.selectByUsername(username, [
			'id',
			'password',
			'first_name',
			'last_name',
			'middle_name',
			'username',
		]);

		if (isEmpty(user)) {
			throw new UnauthorizedException();
		}

		if (user.password !== password) {
			throw new UnauthorizedException();
		}

		delete user.password;

		return this.createToken(user, 8);
	}

	async getUser(token: string) {
		try {
			const verify = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get('CLIENT_SECRET'),
			});

			if (isEmpty(verify) || !verify.exp) {
				throw new ForbiddenException();
			}

			return verify;
		} catch (error) {
			throw new ForbiddenException(error);
		}
	}

	async signup(body: SignUpDto) {
		const isUserExists = await this.userService.selectByUsername(body.username);

		if (!isEmpty(isUserExists)) {
			throw new BadRequestException('this username is already taken');
		}

		const [user] = await this.userService.insert({
			id: generateRecordId(),
			first_name: body.first_name,
			last_name: body.last_name,
			middle_name: body.middle_name,
			email: body.email,
			username: body.username,
			password: body.password,
		});

		delete user.password;

		return this.createToken(user, 8);
	}

	private async createToken(user: ICurrentUser, refreshTokenExpirationInHours: number) {
		try {
			const token = await this.jwtService.signAsync(user, { secret: this.AUTH_CLIENT_SECRET, expiresIn: 8 + 'hrs' });

			return {
				access_token: token,
				created_at: new Date(),
				token_expires_on: new Date(dayjs(new Date()).add(8, 'hours').tz('Asia/Tashkent').format('YYYY-MM-DD HH:mm')),
				refresh_token: generateRandomCode(64),
				refresh_token_expires_on: new Date(
					dayjs(new Date()).add(refreshTokenExpirationInHours, 'hour').tz('Asia/Tashkent').format('YYYY-MM-DD HH:mm'),
				),
			};
		} catch (error) {
			throw new InternalServerErrorException("can't create token ==>", error);
		}
	}
}
