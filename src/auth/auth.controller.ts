import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginByPasswordDto } from './dtos/login-by-password.dto';
import { AuthService } from './auth.service';
import { AuthorizationGuard } from '@shared/guards/authorization.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { ICurrentUser } from 'src/users/interfaces/current-user.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiBody({
		type: LoginByPasswordDto,
		description: 'login by username and password',
	})
	@Post('login-by-password')
	async loginByPassword(@Body() body: LoginByPasswordDto) {
		return this.authService.loginByPassword(body);
	}

	@UseGuards(AuthorizationGuard)
	@ApiBearerAuth('authorization')
	@Post('get-user')
	async getUser(@CurrentUser() user: ICurrentUser) {
		return user;
	}
}
