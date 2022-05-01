import {Field, ID, ObjectType} from "type-graphql";

@ObjectType({description: "Main PoE hero class class model"})
class HeroClass {
    @Field(() => ID)
    public id!: number;

    @Field(() => String, {description: "Hello world"})
    public name!: string;

    @Field(() => String, {nullable: true})
    public imageUrl!: string;
}

export {HeroClass};
