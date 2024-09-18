import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateMessageInput {
  @Field({ nullable: false })
  text: string;
}
