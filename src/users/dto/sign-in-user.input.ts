import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignInUserInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
