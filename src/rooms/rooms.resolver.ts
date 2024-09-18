import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { CreateMessageInput } from './dto/create-message.input';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateMessageInput } from './dto/update-message-input';
import { UpdateRoomInput } from './dto/update-room-input';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { RoomsService } from './rooms.service';
import { AuthGuard } from 'src/auth/auth';

@UseGuards(AuthGuard)
@Resolver(() => Room)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Mutation(() => Room, { name: 'createRoom' })
  createRoom(@Args('input') input: CreateRoomInput, @RequestUser() user: User) {
    return this.roomsService.createRoom(input, user);
  }

  @Mutation(() => Room, { name: 'updateRoom' })
  updateRoom(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: UpdateRoomInput,
    @RequestUser() user: User,
  ) {
    return this.roomsService.updateRoom(id, input, user);
  }

  @Query(() => Room, { name: 'room' })
  findRoom(@Args('id', { type: () => String }) id: string) {
    return this.roomsService.findRoom(id);
  }

  @Query(() => [Room], { name: 'rooms' })
  findRooms() {
    return this.roomsService.findRooms();
  }

  @Mutation(() => Room, { name: 'deleteRoom' })
  deleteRoom(
    @Args('id', { type: () => String }) id: string,
    @RequestUser() user: User,
  ) {
    return this.roomsService.deleteRoom(id, user);
  }

  @Mutation(() => Message, { name: 'createMessage' })
  createMessage(
    @Args('input') createMessageInput: CreateMessageInput,
    @RequestUser() user: User,
  ) {
    return this.roomsService.createMessage(createMessageInput, user);
  }

  @Mutation(() => Message, { name: 'updateMessage' })
  updateMessage(
    @Args('id', { type: () => String }) id: string,
    @Args('input') updateMessageInput: UpdateMessageInput,
    @RequestUser() user: User,
  ) {
    return this.roomsService.updateMessage(id, updateMessageInput, user);
  }

  @Mutation(() => Message, { name: 'deleteMessage' })
  deleteMessage(
    @Args('id', { type: () => String }) id: string,
    @RequestUser() user: User,
  ) {
    return this.roomsService.deleteMessage(id, user);
  }
}
