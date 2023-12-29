import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RoomsResolver } from './rooms.resolver';
import { RoomsService } from './rooms.service';

@Module({
  providers: [RoomsResolver, RoomsService, PrismaService],
})
export class RoomsModule {}
