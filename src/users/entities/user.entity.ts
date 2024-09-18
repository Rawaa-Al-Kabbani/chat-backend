import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  username: string;
}

@ObjectType()
export class AccessToken {
  @Field(() => String)
  access_token: string;

  @Field(() => User)
  user: User;
}
