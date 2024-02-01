import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { MyGateway } from 'src/gateway/gateway';
import { CreateUserInput } from './dto/create-user.input';
import { AccessToken, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: MyGateway,
    private jwtService: JwtService,
  ) {}

  async hashedPassword(data: CreateUserInput): Promise<string> {
    //    const salt = await bcrypt.genSalt();
    //    const hashed = await bcrypt.hash(data.password, 10);
    //    console.log('hashed', hashed);
    return await bcrypt.hash(data.password, 10);
  }

  async createUser(data: CreateUserInput): Promise<any> {
    const lowercaseUsername = data.user_name.toLowerCase();
    const result = await this.hashedPassword(data);
    const newData: CreateUserInput = {
      user_name: lowercaseUsername,
      password: result as any,
    };
    return await this.prisma.user.create({
      data: newData,
    });
  }

  async signIn(userName: string, password: string): Promise<AccessToken> {
    const lowercaseUsername = userName.toLowerCase();
    try {
      const selectedUser = await this.prisma.user.findFirst({
        where: {
          user_name: lowercaseUsername,
        },
      });
      if (!selectedUser) {
        throw new NotFoundException(
          `User with user_name: ${userName} not found`,
        );
      }

      const result = await bcrypt.compare(password, selectedUser.password);
      if (!result) {
        throw new UnauthorizedException();
      }
      const payload = {
        sub: selectedUser.id,
        userName: selectedUser.user_name,
      };
      const token = await this.jwtService.signAsync(payload);
      return {
        access_token: token,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findUser(userName: string, password: string): Promise<User> {
    const lowercaseUsername = userName.toLowerCase();
    try {
      const selectedUser = await this.prisma.user.findFirst({
        where: {
          user_name: lowercaseUsername,
          password: password,
        },
      });
      if (!selectedUser) {
        throw new NotFoundException(
          `User with user_name: ${userName} not found`,
        );
      }
      return selectedUser;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findUserByName(userName: string): Promise<User> {
    const lowercaseUsername = userName.toLowerCase();
    try {
      const selectedUser = await this.prisma.user.findFirst({
        where: {
          user_name: lowercaseUsername,
        },
      });
      if (!selectedUser) {
        throw new NotFoundException(
          `User with user_name: ${userName} not found`,
        );
      }
      return selectedUser;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
