import { Module } from '@nestjs/common';
import { MyGateway } from './gatway';

@Module({
  providers: [MyGateway],
  exports: [MyGateway],
})
export class GatewayModule {}
