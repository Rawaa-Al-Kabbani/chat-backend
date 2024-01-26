import { Injectable, NotFoundException } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { MyGateway } from 'src/gateway/gatway';
import { CreateMessageInput } from './dto/create-message.input';
import { CreateRoomInput } from './dto/create-room.input';
import { Message } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: MyGateway,
  ) {}

  async emitGatewayMessage(roomId: string) {
    return this.gateway.server.emit(roomId, {
      content: 'Update room chat',
    });
  }

  async createRoom(data: CreateRoomInput): Promise<Room> {
    return this.prisma.room.create({
      data,
    });
  }

  findRooms(): Promise<Room[]> {
    return this.prisma.room.findMany({
      include: {
        messages: true,
      },
    });
  }

  async findRoom(id: string): Promise<Room> {
    try {
      const selectedRoom = await this.prisma.room.findUnique({
        where: {
          id: id,
        },
        include: {
          messages: {
            orderBy: {
              created_at: 'asc',
            },
          },
        },
      });
      if (!selectedRoom) {
        throw new NotFoundException(`Room with id ${id} not found`);
      }
      return selectedRoom;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateRoom(id: string, name: string) {
    try {
      const updatedRoom = this.prisma.room.update({
        where: {
          id: id,
        },
        data: {
          name: name,
        },
      });
      if (!updatedRoom) {
        throw new NotFoundException(`Room with id ${id} not found`);
      }

      return updatedRoom;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async removeRoom(id: string): Promise<Room> {
    return this.prisma.room.delete({
      where: {
        id: id,
      },
    });
  }

  async createMessage(data: CreateMessageInput): Promise<Message> {
    const result = await this.prisma.message.create({
      data,
    });

    this.emitGatewayMessage(result.room_id);
    return result;
  }

  async editMessage(id: string, data: CreateMessageInput) {
    try {
      const editedMessage = await this.prisma.message.update({
        where: {
          id: id,
        },
        data: data,
      });
      if (!editedMessage) {
        throw new NotFoundException(`Message with id ${id} not found`);
      }
      this.emitGatewayMessage(data.room_id);
      return editedMessage;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteMessage(id: string): Promise<Message> {
    const result = await this.prisma.message.delete({
      where: {
        id: id,
      },
    });
    this.emitGatewayMessage(result.room_id);
    return result;
  }
}
