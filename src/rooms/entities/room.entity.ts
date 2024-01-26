import { ObjectType, Field } from '@nestjs/graphql';

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
  user_name: string;

  @Field({ nullable: false })
  text: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Field({ nullable: false })
  room_id: string;
}
