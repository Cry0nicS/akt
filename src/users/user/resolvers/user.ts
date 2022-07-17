import env from "env-var";
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {CreateUserInput} from "../types/create-user";
import {isAuthenticated} from "../services/authenticate";
import {LoginResponse} from "../types/login-response";
import {LoginUserInput} from "../types/login-user";
import {Service} from "typedi";
import {UserService} from "../services/user";
import {User} from "../models/user";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- Seems like a bug in ESLint.
import type {Context} from "../../../app/utils/interfaces/context";

@Service()
@Resolver(() => User)
class UserResolver {
    private readonly userService: UserService;

    public constructor(userService: UserService) {
        this.userService = userService;
    }

    @Query(() => User)
    @UseMiddleware(isAuthenticated)
    public async activeUser(@Ctx() ctx: Context): Promise<User> {
        const userId = ctx.activeUserId ?? null;

        if (userId === null) throw new Error("User not logged in.");

        return this.userService.getOneById(parseInt(userId, 10));
    }

    @Mutation(() => User)
    public async createUser(@Arg("data") data: CreateUserInput): Promise<User> {
        return this.userService.create(data);
    }

    @Mutation(() => LoginResponse)
    public async loginUser(
        @Arg("data") {email, password}: LoginUserInput,
        @Ctx() ctx: Context
    ): Promise<LoginResponse> {
        const user = await this.userService.getOneByEmail(email);

        if (!(await user.verifyPassword(password))) {
            throw new Error("You have entered an invalid username or password.");
        }

        // Generate a refresh token and store it in a cookie.
        await UserResolver.createdRefreshToken(user, ctx);

        // Return the access token.
        return {
            accessToken: await UserService.generateJwtToken(
                user,
                env.get("EDDSA_ACCESS_SECRET").required().asString(),
                env.get("JWT_ACCESS_EXPIRATION_TIME").required().asString()
            )
        };
    }

    @Mutation(() => LoginResponse)
    public async refreshToken(@Ctx() ctx: Context): Promise<LoginResponse> {
        const currentRefreshToken = ctx.cookies.get("gid");

        if (currentRefreshToken === undefined) throw new Error("No refresh token found.");

        const userId = await UserService.validateJwtToken(
            currentRefreshToken,
            env.get("EDDSA_REFRESH_PUBLIC").required().asString()
        );

        if (userId === null) throw new Error("Refresh token is invalid.");

        const user = await this.userService.getOneById(parseInt(userId, 10));

        // Regenerate the refresh token and store it in the cookie.
        await UserResolver.createdRefreshToken(user, ctx);

        // Return a new access token.
        return {
            accessToken: await UserService.generateJwtToken(
                user,
                env.get("EDDSA_ACCESS_SECRET").required().asString(),
                env.get("JWT_ACCESS_EXPIRATION_TIME").required().asString()
            )
        };
    }

    private static async createdRefreshToken(user: User, ctx: Context): Promise<void> {
        const refreshToken = await UserService.generateJwtToken(
            user,
            env.get("EDDSA_REFRESH_SECRET").required().asString(),
            env.get("JWT_REFRESH_EXPIRATION_TIME").required().asString()
        );

        ctx.cookies.set("gid", refreshToken, {httpOnly: true});
    }
}

export {UserResolver};
