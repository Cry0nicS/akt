import {Field, ObjectType} from "type-graphql";
import {BaseError} from "./base-error";

@ObjectType()
class UnexpectedError extends BaseError {
    @Field()
    public reason?: string;

    public constructor(reason?: string) {
        super("An unexpected error occurred.", "UNEXPECTED_ERROR", 500, reason);
    }
}

export {UnexpectedError};
