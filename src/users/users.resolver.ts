import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { AccessToken, User } from './entities/user.entity';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User, { name: 'createUser' })
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  @Mutation(() => User, { name: 'findUser' })
  findUser(
    @Args('userName', { type: () => String }) userName: string,
    @Args('password', { type: () => String }) password: string,
  ) {
    return this.usersService.findUser(userName, password);
  }

  @Mutation(() => User, { name: 'findUserByName' })
  findUserByName(@Args('userName', { type: () => String }) userName: string) {
    return this.usersService.findUserByName(userName);
  }

  @Mutation(() => AccessToken, { name: 'signIn' })
  signIn(
    @Args('userName', { type: () => String }) userName: string,
    @Args('password', { type: () => String }) password: string,
  ) {
    return this.usersService.signIn(userName, password);
  }
}
