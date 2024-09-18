import { ObjectType, Field } from '@nestjs/graphql';
import { Message } from './message.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Room {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field({ nullable: false })
  created_by_id: string;

  @Field(() => User, { nullable: true })
  created_by?: User;

  @Field(() => [Message], { nullable: true })
  messages?: Message[];

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
