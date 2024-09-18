import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { AccessToken } from 'src/auth/entities/acess-token.entity';
import { ChangeUserPasswordInput } from './dto/change-user-password.input';
import { CreateUserInput } from './dto/create-user.input';
import { SignInUserInput } from './dto/sign-in-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createUser({
    username,
    password,
  }: CreateUserInput): Promise<AccessToken> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      throw new GraphQLError('A user with this username already exists');
    }

    const newUser = await this.prisma.user.create({
      data: {
        username,
        password: await this.authService.hashPassword(password),
      },
    });

    return this.authService.generateAccessToken(newUser);
  }

  async signIn({ username, password }: SignInUserInput): Promise<AccessToken> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new GraphQLError(`Invalid username or password`);
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw new GraphQLError('Invalid username or password');
    }

    return this.authService.generateAccessToken(user);
  }

  async changePassword(
    { old_password, new_password }: ChangeUserPasswordInput,
    user: User,
  ): Promise<User> {
    const userRecord = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userRecord) {
      throw new GraphQLError(`An unexpected error occurred`);
    }

    const oldPasswordCompare = await bcrypt.compare(
      old_password,
      userRecord.password,
    );
    if (!oldPasswordCompare) {
      throw new GraphQLError('Incorrect old password');
    }

    const newUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await this.authService.hashPassword(new_password),
      },
    });

    return newUser;
  }
}
