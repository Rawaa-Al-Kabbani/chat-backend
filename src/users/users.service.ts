import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { AccessToken, User } from './entities/user.entity';
import { GraphQLError } from 'graphql';
import { SignInUserInput } from './dto/sign-in-user.input';
import { ChangeUserPasswordInput } from './dto/change-user-password.input';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getHashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async getAccessToken({ id, username }: User): Promise<AccessToken> {
    const payload = {
      sub: id,
      username: username,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id,
        username,
      },
    };
  }

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
        password: await this.getHashedPassword(password),
      },
    });

    return this.getAccessToken(newUser);
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

    return this.getAccessToken(user);
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
        password: await this.getHashedPassword(new_password),
      },
    });

    return newUser;
  }
}
