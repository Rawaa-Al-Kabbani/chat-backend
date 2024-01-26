import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => String)
  room_id: string;

  @Field({ nullable: false })
  user_name: string;

  @Field({ nullable: false })
  text: string;
}
