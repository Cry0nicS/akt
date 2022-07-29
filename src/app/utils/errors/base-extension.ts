import type {GraphQLErrorExtensions} from "graphql/error/GraphQLError";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
class BaseExtension implements GraphQLErrorExtensions {
    @Field()
    public code: string;

    @Field()
    public reason?: string;

    @Field()
    public statusCode?: number;

    public constructor(code: string, reason?: string, statusCode?: number) {
        this.code = code;
        if (statusCode !== undefined) {
            this.statusCode = statusCode;
        }

        if (reason !== undefined) {
            this.reason = reason;
        }
    }
}

export {BaseExtension};
