import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'prisma/prisma.service';
import { GatewayService } from 'src/gateway/gateway';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '180m' },
    }),
  ],
  providers: [UsersResolver, UsersService, PrismaService, GatewayService],
})
export class UsersModule {}
