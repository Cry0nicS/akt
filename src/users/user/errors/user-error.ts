import {BaseError} from "../../../app/utils/errors/base-error";

class UserError extends BaseError {
    public static missingRefreshToken(): UserError {
        return new UserError("No refresh token provided.", "MISSING_REFRESH_TOKEN", 409);
    }

    public static invalidRefreshToken(): UserError {
        return new UserError("Provided refresh token is not valid.", "INVALID_REFRESH_TOKEN", 400);
    }

    public static refreshTokenVersionNotMatched(): UserError {
        return new UserError(
            "Invalid refresh token.",
            "INVALID_REFRESH_TOKEN",
            401,
            "Provided token version does not match user's token version."
        );
    }

    public static invalidEmailOrPassword(): UserError {
        return new UserError(
            "Invalid email or password.",
            "INVALID_EMAIL_OR_PASSWORD",
            409,
            "Email and password do not match."
        );
    }

    public static authenticationError(message: string): UserError {
        return new UserError("Authentication error.", "AUTHENTICATION_ERROR", 401, message);
    }

    public static userNotLoggedIn(): UserError {
        return new UserError("User not logged in.", "USER_NOT_LOGGED_IN", 401);
    }
}

export {UserError};
