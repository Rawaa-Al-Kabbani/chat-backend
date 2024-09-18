import { ObjectType, Field } from '@nestjs/graphql';
import { Message } from './message.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Room {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  created_by_id: string;

  @Field(() => User)
  created_by: User;

  @Field(() => [Message])
  messages: Message[];

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
