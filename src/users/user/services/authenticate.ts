import env from "env-var";
import type {Context} from "../../../app/utils/interfaces/context";
import type {MiddlewareFn} from "type-graphql";
import {isError} from "../types/result-type";
import {UserService} from "./user";

// User has to send "Bearer" + token in the Authorization header.
const isAuthenticated: MiddlewareFn<Context> = async ({context}, next) => {
    // Read the header from the request.
    const {authorization} = context.req.headers;

    // TODO: Consider not throwing an error if user is not logged in. Rather, return a context without activeUserId.
    if (authorization === undefined) throw new Error("Authorization header is missing.");

    if (!authorization.startsWith("Bearer ")) throw new Error("Authorization header is invalid.");

    // Get the token from the Authorization header.
    const token = authorization.split(" ")[1];

    // Validate the access token and store it in the context.
    const result = await UserService.validateJwtToken(
        token,
        env.get("EDDSA_ACCESS_PUBLIC").required().asString()
    );

    if (isError(result)) throw result;

    // TODO: validate the user's token version.

    context.activeUserId = result.sub;

    return next();
};

export {isAuthenticated};
