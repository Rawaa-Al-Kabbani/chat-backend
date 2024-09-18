import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WebSocketGateway } from '@nestjs/websockets';
import { GatewayService } from './gateway/gateway';

function decorateGateway(class_: any, configService: ConfigService) {
  const socketConfig = configService.get('socket');
  let port = socketConfig.port;
  if (typeof port === 'string') {
    port = parseInt(port, 10);
  } else {
    port = 5001;
  }

  const origin = socketConfig.origin;
  WebSocketGateway(port, {
    cors: {
      origin,
    },
  })(class_);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  decorateGateway(GatewayService, configService);
  await app.listen(configService.get('PORT') as string);
}
bootstrap();
