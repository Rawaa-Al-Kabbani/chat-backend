import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { ChangeUserPasswordInput } from './dto/change-user-password.input';
import { CreateUserInput } from './dto/create-user.input';
import { SignInUserInput } from './dto/sign-in-user.input';
import { UsersService } from './users.service';
import { AccessToken } from 'src/auth/entities/acess-token.entity';
import { User } from './entities/user.entity';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => AccessToken, { name: 'createUser' })
  createUser(@Args('input') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  @Mutation(() => AccessToken, { name: 'signIn' })
  signIn(@Args('input') signInUserInput: SignInUserInput) {
    return this.usersService.signIn(signInUserInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User, { name: 'changePassword' })
  changePassword(
    @Args('input') changeUserPasswordInput: ChangeUserPasswordInput,
    @RequestUser() user: User,
  ) {
    return this.usersService.changePassword(changeUserPasswordInput, user);
  }
}
