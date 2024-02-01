import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'prisma/prisma.service';
import { MyGateway } from 'src/gateway/gateway';
import { JwtModule } from '@nestjs/jwt';

export const JWT_SECRET = 'hej';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1m' },
    }),
  ],
  providers: [UsersResolver, UsersService, PrismaService, MyGateway],
})
export class UsersModule {}
