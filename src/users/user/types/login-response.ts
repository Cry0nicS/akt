import {Field, ObjectType} from "type-graphql";

@ObjectType()
class LoginResponse {
    @Field(() => String)
    public accessToken!: string;
}

export {LoginResponse};
