import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Room {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => [Message], { nullable: true })
  messages?: Message[];
}

@ObjectType()
export class Message {
  @Field(() => String)
  id: string;

  @Field({ nullable: false })
  user_id: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: false })
  text: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Field({ nullable: false })
  room_id: string;
}
