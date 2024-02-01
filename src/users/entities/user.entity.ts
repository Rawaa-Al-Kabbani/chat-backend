import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  user_name: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
export class AccessToken {
  @Field(() => String)
  access_token: string;
}
