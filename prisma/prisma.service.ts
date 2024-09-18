import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
  }
  async onApplicationShutdown() {
    await this.$disconnect();
  }
}