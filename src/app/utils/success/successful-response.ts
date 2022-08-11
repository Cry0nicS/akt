import {Field, ObjectType} from "type-graphql";

@ObjectType()
class SuccessfulResponse {
    @Field(() => String, {nullable: true})
    public code?: number | null;

    @Field(() => String)
    public message!: string;

    @Field(() => Boolean)
    public success!: boolean;

    public constructor(message: string, success: boolean, code?: number | null) {
        this.message = message;
        this.success = success;

        if (code !== undefined) {
            this.code = code;
        }
    }
}

export {SuccessfulResponse};
