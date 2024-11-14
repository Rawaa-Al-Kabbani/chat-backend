import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { GatewayService } from 'src/gateway/gateway';

@Module({
  providers: [
    UsersResolver,
    UsersService,
    PrismaService,
    GatewayService,
    JwtService,
    AuthModule,
  ],
  imports: [AuthModule, ConfigModule],
})
export class UsersModule {}
