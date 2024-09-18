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

  async emitGatewayMessage(roomId: string) {
    return this.gateway.server.emit(roomId, {
      content: 'Update room chat',
    });
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
    return this.prisma.room.create({
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

    return this.prisma.room.delete({
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
    this.emitGatewayMessage(deletedMessage.room_id);
    return deletedMessage;
  }
}
