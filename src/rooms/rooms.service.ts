import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MyGateway } from 'src/gateway/gateway';
import { CreateRoomInput } from './dto/create-room.input';
import { Message, Room } from './entities/room.entity';
import { CreateMessageInput } from './dto/create-message.input';

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

  async createRoom(
    data: CreateRoomInput,
    userId: string | undefined,
  ): Promise<Room | undefined> {
    if (userId) {
      return this.prisma.room.create({
        data,
      });
    }
    return;
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
            include: {
              user: true,
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
    // check if is logged in
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

  async removeRoom(
    id: string,
    userId: string | undefined,
  ): Promise<Room | undefined> {
    if (userId) {
      return this.prisma.room.delete({
        where: {
          id: id,
        },
      });
    }
    return;
  }

  async createMessage(
    data: CreateMessageInput,
    userId: string | undefined,
  ): Promise<Message | undefined> {
    console.log('userId', userId);
    if (userId !== undefined) {
      const result = await this.prisma.message.create({
        data: {
          ...data,
          user_id: userId,
        },
      });
      this.emitGatewayMessage(result.room_id);
      return result;
    }
    return;
  }

  async editMessage(
    id: string,
    data: CreateMessageInput,
    userId: string | undefined,
  ) {
    if (userId !== undefined) {
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
  }

  async deleteMessage(
    id: string,
    userId: string | undefined,
  ): Promise<Message | undefined> {
    if (userId) {
      const result = await this.prisma.message.delete({
        where: {
          id: id,
        },
      });
      this.emitGatewayMessage(result.room_id);
      return result;
    }
    return;
  }
}
