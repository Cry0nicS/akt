import env from "env-var";
import type {Context} from "../../../app/utils/interfaces/context";
import type {MiddlewareFn} from "type-graphql";
import {UserService} from "./user";

// User has to send "Bearer" + token in the Authorization header.
const isAuthenticated: MiddlewareFn<Context> = async ({context}, next) => {
    // Read the header from the request.
    const {authorization} = context.req.headers;

    if (authorization === undefined) throw new Error("Authorization header is missing.");

    if (!authorization.startsWith("Bearer ")) throw new Error("Authorization header is invalid.");

    // Get the token from the Authorization header.
    const token = authorization.split(" ")[1];

    // Validate the access token and store it in the context.
    const payload = await UserService.validateJwtToken(
        token,
        env.get("EDDSA_ACCESS_PUBLIC").required().asString()
    );

    const userId = payload.sub ?? null;

    if (userId === null) throw new Error("Unexpected error while authenticating.");

    // TODO: validate the user's token version.

    context.activeUserId = userId;

    return next();
};

export {isAuthenticated};
