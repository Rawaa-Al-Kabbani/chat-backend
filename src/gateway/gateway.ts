import { OnModuleInit } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export class GatewayService implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log(`Socket ${socket.id} connected...`);

      socket.on('joinRoom', (roomId: string) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
      });

      socket.on('leaveRoom', (roomId: string) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
      });

      socket.on('joinRooms', (event: string) => {
        socket.join(event);
        console.log(`Socket ${socket.id} joined the rooms namespace`);
      });

      socket.on('leaveRooms', (event: string) => {
        socket.leave(event);
        console.log(`Socket ${socket.id} left room ${event}`);
      });

      socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
      });
    });
  }
}
