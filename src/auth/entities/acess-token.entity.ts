import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class AccessToken {
  @Field(() => String)
  access_token: string;

  @Field(() => User)
  user: User;
}
