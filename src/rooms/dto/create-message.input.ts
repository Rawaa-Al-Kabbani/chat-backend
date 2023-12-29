import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => Int)
  room_id: number;

  @Field({ nullable: false })
  user_name: string;

  @Field({ nullable: false })
  text: string;
}
