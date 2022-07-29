import {ApolloError} from "apollo-server-koa";
import {Field, ObjectType} from "type-graphql";
import {BaseExtension} from "./base-extension";

@ObjectType()
class BaseError extends ApolloError {
    @Field()
    public override message!: string;

    @Field()
    public override extensions!: BaseExtension;

    public constructor(message: string, code: string, statusCode?: number, reason?: string) {
        super(message);

        this.extensions = new BaseExtension(code, reason, statusCode);
    }
}

export {BaseError};
