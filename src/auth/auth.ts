import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const req = gqlCtx.getContext().req;
    if (!req.headers) {
      throw new UnauthorizedException();
    }
    if (
      req.headers['authorization'] &&
      req.headers['authorization'].split(' ')[0] !== 'Bearer'
    ) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const token = req.headers['authorization']
      ? req.headers['authorization'].split(' ')[1]
      : null;
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      req.user = {
        id: payload.sub,
        username: payload.username,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
