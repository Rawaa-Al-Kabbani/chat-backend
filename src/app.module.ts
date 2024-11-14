import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import * as cors from 'cors';
import { PrismaService } from 'prisma/prisma.service';
import { GatewayModule } from './gateway/gateway.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomsResolver } from './rooms/rooms.resolver';
import { RoomsService } from './rooms/rooms.service';
import { UsersModule } from './users/users.module';
import { UsersResolver } from './users/users.resolver';
import { UsersService } from './users/users.service';
import configuration from '../config/configuration';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [configuration],
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
    }),
    RoomsModule,
    GatewayModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    RoomsService,
    RoomsResolver,
    UsersService,
    UsersResolver,
    PrismaService,
    JwtService,
    AuthService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
