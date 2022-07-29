import {BaseError} from "../../../app/utils/errors/base-error";

const missingRefreshToken = new BaseError(
    "No refresh token provided.",
    "MISSING_REFRESH_TOKEN",
    409
);
const invalidRefreshToken = new BaseError(
    "Provided refresh token is not valid.",
    "INVALID_REFRESH_TOKEN",
    400
);
const refreshTokenVersionNotMatched = new BaseError(
    "Invalid refresh token.",
    "INVALID_REFRESH_TOKEN",
    401,
    "Provided token version does not match user's token version."
);

const invalidEmailOrPassword = new BaseError(
    "Invalid email or password.",
    "INVALID_EMAIL_OR_PASSWORD",
    409,
    "Email and password do not match."
);

export {
    invalidEmailOrPassword,
    invalidRefreshToken,
    missingRefreshToken,
    refreshTokenVersionNotMatched
};
