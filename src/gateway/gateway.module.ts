import { Module } from '@nestjs/common';
import { GatewayService } from './gateway';

@Module({
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
