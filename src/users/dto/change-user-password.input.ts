import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChangeUserPasswordInput {
  @Field(() => String)
  old_password: string;

  @Field(() => String)
  new_password: string;
}
