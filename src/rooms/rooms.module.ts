import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GatewayService } from 'src/gateway/gateway';
import { RoomsResolver } from './rooms.resolver';
import { RoomsService } from './rooms.service';

@Module({
  providers: [RoomsResolver, RoomsService, PrismaService, GatewayService],
})
export class RoomsModule {}
