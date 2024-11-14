import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { PrismaService } from 'prisma/prisma.service';
import { GatewayService } from 'src/gateway/gateway';
import { User } from 'src/users/entities/user.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room-input';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { UpdateMessageInput } from './dto/update-message-input';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: GatewayService,
  ) {}

  async emitRoomEvent(event: string, payload: any) {
    try {
      this.gateway.server.emit(event, payload);
    } catch (error) {
      console.error(`Failed to emit room event (${event}):`, error);
    }
  }

  async emitGatewayMessage(roomId: string) {
    try {
      this.gateway.server.emit(roomId, {
        content: 'Update room chat',
      });
    } catch (error) {
      console.error(`Failed to emit update for room ${roomId}:`, error);
    }
  }

  async createRoom(data: CreateRoomInput, user: User): Promise<Room> {
    const room = await this.prisma.room.findUnique({
      where: {
        name: data.name,
      },
    });

    if (room) {
      throw new GraphQLError(`A room with this name already exists`);
    }
    const createdRoom = this.prisma.room.create({
      data: { ...data, created_by_id: user.id },
      include: {
        created_by: true,
        messages: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!createdRoom) {
      throw new GraphQLError(`Unable to update room`);
    }
    this.emitRoomEvent('roomCreated', createdRoom);
    return createdRoom;
  }

  findRooms(): Promise<Room[]> {
    return this.prisma.room.findMany({
      include: {
        created_by: true,
        messages: {
          orderBy: {
            created_at: 'asc',
          },
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findRoom(id: string): Promise<Room> {
    const room = await this.prisma.room.findUnique({
      where: {
        id: id,
      },
      include: {
        created_by: true,
        messages: {
          orderBy: {
            created_at: 'asc',
          },
          include: {
            user: true,
          },
        },
      },
    });
    if (!room) {
      throw new GraphQLError(`Room with id ${id} not found`);
    }
    return room;
  }

  async updateRoom(id: string, data: UpdateRoomInput, user: User) {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
        created_by_id: user.id,
      },
    });

    if (!room) {
      throw new GraphQLError(`Room with id ${id} not found`);
    }
    const updatedRoom = await this.prisma.room.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
      include: {
        created_by: true,
      },
    });
    if (!updatedRoom) {
      throw new GraphQLError(`Unable to update room`);
    }
    this.emitRoomEvent('roomUpdated', updatedRoom);
    return updatedRoom;
  }

  async deleteRoom(id: string, user: User): Promise<Room> {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
        created_by_id: user.id,
      },
    });

    if (!room) {
      throw new GraphQLError(`The room does not exist`);
    }

    const deletedRoom = this.prisma.room.delete({
      where: {
        id,
      },
      include: {
        created_by: true,
        messages: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!deletedRoom) {
      throw new GraphQLError(`Unable to update room`);
    }
    this.emitRoomEvent('roomDeleted', deletedRoom);

    return deletedRoom;
  }

  async createMessage(data: CreateMessageInput, user: User): Promise<Message> {
    const message = await this.prisma.message.create({
      data: {
        ...data,
        user_id: user.id,
      },
      include: {
        user: true,
      },
    });
    this.emitGatewayMessage(message.room_id);
    return message;
  }

  async updateMessage(id: string, data: UpdateMessageInput, user: User) {
    const message = await this.prisma.message.findUnique({
      where: {
        id,
        user_id: user.id,
      },
    });

    if (!message) {
      throw new GraphQLError(`The message does not exist`);
    }
    const updatedMessage = await this.prisma.message.update({
      where: {
        id,
      },
      data,
      include: {
        user: true,
      },
    });
    if (!updatedMessage) {
      throw new GraphQLError(`Unable to update message`);
    }
    this.emitGatewayMessage(message.room_id);
    return updatedMessage;
  }

  async deleteMessage(id: string, user: User): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: {
        id,
        user_id: user.id,
      },
    });

    if (!message) {
      throw new GraphQLError(`The message does not exist`);
    }
    const deletedMessage = await this.prisma.message.delete({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    });
    this.emitGatewayMessage(message.room_id);
    return deletedMessage;
  }
}
