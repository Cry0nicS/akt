import {Service} from "typedi";
import {Arg, Mutation, Resolver} from "type-graphql";
import {User} from "../models/user";
import {UserService} from "../services/user";
import {CreateUserInput} from "../types/create-user";
import {LoginResponse} from "./login-response";
import {LoginUserInput} from "../types/login-user";

@Service()
@Resolver(() => User)
class UserResolver {
    private readonly userService: UserService;

    public constructor(userService: UserService) {
        this.userService = userService;
    }

    @Mutation(() => User)
    public async createUser(@Arg("data") data: CreateUserInput): Promise<User> {
        return this.userService.create(data);
    }

    @Mutation(() => LoginResponse)
    public async loginUser(@Arg("data") {email, password}: LoginUserInput): Promise<LoginResponse> {
        return this.userService.login(email, password);
    }
}

export {UserResolver};
