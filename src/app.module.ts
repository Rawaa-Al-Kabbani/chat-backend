import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import * as cors from 'cors';
import { PrismaService } from 'prisma/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomsResolver } from './rooms/rooms.resolver';
import { RoomsService } from './rooms/rooms.service';
import { UsersModule } from './users/users.module';
import { UsersResolver } from './users/users.resolver';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    RoomsModule,
    GatewayModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RoomsService,
    RoomsResolver,
    UsersService,
    UsersResolver,
    PrismaService,
    JwtService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
