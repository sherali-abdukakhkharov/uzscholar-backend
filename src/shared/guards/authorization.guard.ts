import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
	@Inject() private readonly authService: AuthService;

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		let tokenId = request.headers.authorization;
		if (!tokenId) {
			throw new UnauthorizedException('No authentication credentials provided');
		}

		if (tokenId.startsWith('Bearer ')) {
			tokenId = tokenId.substring('Bearer '.length);
		}

		const user: any = await this.authService.getUser(tokenId);
		if (!user || !user.id) {
			throw new UnauthorizedException('Invalid authentication token');
		}

		request.user = user;

		return true;
	}
}
