import env from "env-var";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- Seems like a bug in ESLint.
import type {Context} from "../../../app/utils/interfaces/context";
import type {JWTPayload} from "jose";
import {Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {CreateUserInput} from "../types/create-user";
import {isAuthenticated} from "../services/authenticate";
import {LoginUserInput} from "../types/login-user";
import {isUser, LoginUserResult, RefreshTokenResult} from "../types/result-type";
import {Service} from "typedi";
import {UnexpectedError} from "../../../app/utils/errors/unexpected-error";
import {UserError} from "../errors/user-error";
import {UserService} from "../services/user";
import {User} from "../models/user";

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

    @Mutation(() => Boolean)
    public logoutUser(@Ctx() ctx: Context): boolean {
        UserResolver.setRefreshTokenCookie(ctx, "");

        return true;
    }

    @Mutation(() => LoginUserResult)
    public async loginUser(
        @Arg("data") {email, password}: LoginUserInput,
        @Ctx() ctx: Context
    ): Promise<typeof LoginUserResult> {
        const result = await this.userService.getOneByEmail(email);

        if (!isUser(result)) {
            return result;
        }

        // Variable used just for commodity.
        const user = result;

        if (!(await user.verifyPassword(password))) {
            // Return an error if the password is invalid.
            return UserError.invalidEmailOrPassword();
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

    /**
     * This mutation is only used for testing purposes.
     * User's refresh tokens should be revoked when the user logs out or forget the password..
     */
    @Mutation(() => Boolean)
    public async revokeUserRefreshToken(
        @Arg("userId", () => Int) userId: number
    ): Promise<boolean> {
        await this.userService.incrementUserRefreshToken(userId);

        return true;
    }

    @Mutation(() => RefreshTokenResult)
    public async refreshToken(@Ctx() ctx: Context): Promise<typeof RefreshTokenResult> {
        const currentRefreshToken = ctx.cookies.get("gid");

        if (currentRefreshToken === undefined) return UserError.missingRefreshToken();

        let payload: Pick<JWTPayload, "jti" | "sub">;

        try {
            payload = await UserService.validateJwtToken(
                currentRefreshToken,
                env.get("EDDSA_REFRESH_PUBLIC").required().asString()
            );
        } catch (e) {
            return UserError.invalidRefreshToken();
        }

        const userId = payload.sub ?? null;
        const payloadTokenVersion = payload.jti ?? null;

        if (userId === null)
            return new UnexpectedError("User ID could not be extracted from the refresh token.");

        const user = await this.userService.getOneById(parseInt(userId, 10));

        // Compare to token version stored in the database with the one from the payload.
        // TODO: Move this to a service method and use it in the authentication middleware.
        if (
            payloadTokenVersion === null ||
            user.tokenVersion !== parseInt(payloadTokenVersion, 10)
        ) {
            return UserError.refreshTokenVersionNotMatched();
        }

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

        UserResolver.setRefreshTokenCookie(ctx, refreshToken);
    }

    private static setRefreshTokenCookie(ctx: Context, token: string): void {
        ctx.cookies.set("gid", token, {httpOnly: true, secure: true, sameSite: "none"});
    }
}

export {UserResolver};
