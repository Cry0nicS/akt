import {Service} from "typedi";
import {Arg, Mutation, Resolver} from "type-graphql";
import {User} from "../models/user";
import {UserService} from "../services/user";
import {CreateUserInput} from "../types/create-user";
import * as jf from "joiful";

@Service()
@Resolver(() => User)
class UserResolver {
    private readonly userService: UserService;

    public constructor(userService: UserService) {
        this.userService = userService;
    }

    @Mutation(() => User)
    public async createUser(@Arg("data") data: CreateUserInput): Promise<User> {
        const {error} = jf.validate(data);

        if (!error) {
            return this.userService.create(data);
        }

        throw new Error(error.message);
    }
}

export {UserResolver};
