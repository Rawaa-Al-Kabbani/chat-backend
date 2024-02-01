import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../users/users.guard';
import { CreateMessageInput } from './dto/create-message.input';
import { CreateRoomInput } from './dto/create-room.input';
import { Message, Room } from './entities/room.entity';
import { RoomsService } from './rooms.service';

@Resolver(() => Room)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Room, { name: 'createRoom' })
  createRoom(
    @Args('createRoomInput') createRoomInput: CreateRoomInput,
    @Context() context: any,
  ) {
    const user = context.req.user; // Access user payload from GraphQL context
    const newUserId = user.sub;
    return this.roomsService.createRoom(
      createRoomInput,
      newUserId || undefined,
    );
  }

  @Mutation(() => Room, { name: 'room' })
  findRoom(@Args('id', { type: () => String }) id: string) {
    return this.roomsService.findRoom(id);
  }

  @Query(() => [Room], { name: 'rooms' })
  findRooms() {
    return this.roomsService.findRooms();
  }

  @Mutation(() => Room, { name: 'updateRoom' })
  updateRoom(
    @Args('id', { type: () => String }) id: string,
    @Args('name', { type: () => String }) name: string,
  ) {
    return this.roomsService.updateRoom(id, name);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Room, { name: 'removeRoom' })
  removeRoom(
    @Args('id', { type: () => String }) id: string,
    @Context() context: any,
  ) {
    const user = context.req.user; // Access user payload from GraphQL context
    const newUserId = user.sub;
    return this.roomsService.removeRoom(id, newUserId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Message, { name: 'createMessage' })
  async createMessage(
    @Args('input') createMessageInput: CreateMessageInput,
    @Context() context: any,
  ) {
    const user = context.req.user; // Access user payload from GraphQL context
    const newUserId = user.sub;
    return this.roomsService.createMessage(createMessageInput, newUserId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Message, { name: 'editMessage' })
  async editMessage(
    @Args('id', { type: () => String }) id: string,
    @Args('input') createMessageInput: CreateMessageInput,
    @Context() context: any,
  ) {
    const user = context.req.user; // Access user payload from GraphQL context
    const newUserId = user.sub;
    return this.roomsService.editMessage(id, createMessageInput, newUserId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Message, { name: 'deleteMessage' })
  deleteMessage(
    @Args('id', { type: () => String }) id: string,
    @Context() context: any,
  ) {
    const user = context.req.user; // Access user payload from GraphQL context
    const newUserId = user.sub;
    return this.roomsService.deleteMessage(id, newUserId);
  }
}
