import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateRoomInput {
  @Field(() => String, { nullable: false })
  name: string;
}
