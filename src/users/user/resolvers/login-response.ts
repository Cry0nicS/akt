import {Field, ObjectType} from "type-graphql";

@ObjectType()
class LoginResponse {
    @Field(() => String)
    public token!: string;
}

export {LoginResponse};
