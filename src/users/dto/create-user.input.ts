import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  user_name: string;

  @Field(() => String)
  password: string;
}
