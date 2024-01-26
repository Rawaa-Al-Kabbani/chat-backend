import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMessageInput } from './dto/create-message.input';
import { CreateRoomInput } from './dto/create-room.input';
import { Message, Room } from './entities/room.entity';
import { RoomsService } from './rooms.service';

@Resolver(() => Room)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Mutation(() => Room, { name: 'createRoom' })
  createRoom(@Args('createRoomInput') createRoomInput: CreateRoomInput) {
    return this.roomsService.createRoom(createRoomInput);
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

  @Mutation(() => Room, { name: 'removeRoom' })
  removeRoom(@Args('id', { type: () => String }) id: string) {
    return this.roomsService.removeRoom(id);
  }

  @Mutation(() => Message, { name: 'createMessage' })
  async createMessage(@Args('input') createMessageInput: CreateMessageInput) {
    return this.roomsService.createMessage(createMessageInput);
  }

  @Mutation(() => Message, { name: 'editMessage' })
  async editMessage(
    @Args('id', { type: () => String }) id: string,
    @Args('input') createMessageInput: CreateMessageInput,
  ) {
    return this.roomsService.editMessage(id, createMessageInput);
  }

  @Mutation(() => Message, { name: 'deleteMessage' })
  deleteMessage(@Args('id', { type: () => String }) id: string) {
    return this.roomsService.deleteMessage(id);
  }
}
