import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MyGateway } from 'src/gateway/gateway';
import { RoomsResolver } from './rooms.resolver';
import { RoomsService } from './rooms.service';

@Module({
  providers: [RoomsResolver, RoomsService, PrismaService, MyGateway],
})
export class RoomsModule {}
