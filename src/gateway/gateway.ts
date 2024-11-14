import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

const SOCKET_PORT = process.env.SOCKET_PORT
  ? parseInt(process.env.SOCKET_PORT, 10)
  : 5001;

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';

@WebSocketGateway(SOCKET_PORT, {
  cors: {
    origin: [CORS_ORIGIN],
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
