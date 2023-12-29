import { Injectable, NotFoundException } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMessageInput } from './dto/create-message.input';
import { CreateRoomInput } from './dto/create-room.input';
import { Message } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findRoom(id: number): Promise<Room> {
    try {
      const selectedRoom = await this.prisma.room.findUnique({
        where: {
          id: id,
        },
        include: {
          messages: true,
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

  async updateRoom(id: number, name: string) {
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

  async removeRoom(id: number): Promise<Room> {
    return this.prisma.room.delete({
      where: {
        id: id,
      },
    });
  }

  async createMessage(data: CreateMessageInput): Promise<Message> {
    return this.prisma.message.create({
      data,
    });
  }

  async editMessage(id: number, data: CreateMessageInput) {
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
      return editedMessage;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteMessage(id: number): Promise<Message> {
    return this.prisma.message.delete({
      where: {
        id: id,
      },
    });
  }
}
