import {Field, ObjectType} from "type-graphql";
import {BaseError} from "./base-error";

@ObjectType()
class NotFoundError extends BaseError {
    @Field()
    public entityName!: string;

    @Field()
    public propertyName!: string;

    @Field(() => String)
    public propertyValue!: string;

    public constructor(entityName: string, propertyName: string, propertyValue: string) {
        const message = `${entityName} with ${propertyName} "${propertyValue}" not found.`;

        super(message, "NOT_FOUND", 404);
    }
}

export {NotFoundError};
