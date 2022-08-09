import {createUnionType} from "type-graphql";
import {LoginResponse} from "./login-response";
import {BaseError} from "../../../app/utils/errors/base-error";
import {User} from "../models/user";
import {NotFoundError} from "../../../app/utils/errors/not-found-error";

// TODO: Research the naming-convention rule.
// eslint-disable-next-line @typescript-eslint/naming-convention
const RefreshTokenResult = createUnionType({
    name: "RefreshTokenResult",
    types: () => [LoginResponse, BaseError],
    resolveType: (value) => {
        if ("message" in value) {
            return BaseError;
        }

        if ("accessToken" in value) {
            return LoginResponse;
        }

        return undefined;
    }
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const LoginUserResult = createUnionType({
    name: "LoginUserResult",
    types: () => [LoginResponse, BaseError],
    resolveType: (value) => {
        if ("message" in value) {
            return BaseError;
        }

        if ("accessToken" in value) {
            return LoginResponse;
        }

        return undefined;
    }
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const UserResult = createUnionType({
    name: "UserResults",
    types: () => [User, NotFoundError],
    resolveType: (value) => {
        if ("message" in value) {
            return NotFoundError;
        }

        if ("username" in value) {
            return User;
        }

        return undefined;
    }
});

// Type guards.
const isUser = (result: typeof UserResult): result is User => result.id !== undefined;

export {isUser, LoginUserResult, RefreshTokenResult, UserResult};
