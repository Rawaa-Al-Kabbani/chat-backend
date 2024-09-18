import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(5001, {
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class GatewayService implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Socket ${socket.id} connected...`);
    });
  }
}
