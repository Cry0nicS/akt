import type {User} from "../models/user";
import {Field, InputType} from "type-graphql";
import * as jf from "joiful";

@InputType({description: "Fields used to create a new user"})
class CreateUserInput implements Partial<User> {
    @Field(() => String)
    @jf.string().required().max(50)
    public username!: string;

    @Field({nullable: true})
    @jf.string().optional().max(75)
    public firstName?: string;

    @Field({nullable: true})
    @jf.string().optional().max(75)
    public lastName?: string;

    @Field(() => String)
    @jf.string().required().email().min(3).max(255)
    public email!: string;

    @Field(() => String, {
        description:
            "Minimum eight characters, at least one letter, one number and one special character"
    })
    @jf
        .string()
        .required()
        .min(8)
        .max(82)
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/u)
    public password!: string;
}

export {CreateUserInput};
