import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GatewayService } from 'src/gateway/gateway';
import { RoomsResolver } from './rooms.resolver';
import { RoomsService } from './rooms.service';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    RoomsResolver,
    RoomsService,
    PrismaService,
    GatewayService,
    JwtService,
  ],
  imports: [UsersModule, ConfigModule],
})
export class RoomsModule {}
