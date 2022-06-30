import type {User} from "../models/user";
import {Field, InputType} from "type-graphql";
import * as jf from "joiful";

@InputType({description: "Fields used to login a user"})
class LoginUserInput implements Partial<User> {
    @Field(() => String)
    @jf.string().required().email().min(3).max(255)
    public email!: string;

    @Field(() => String, {
        description:
            "Minimum eight characters, at least one letter, one number and one special character"
    })
    @jf.string().required()
    public password!: string;
}

export {LoginUserInput};
