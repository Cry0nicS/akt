import {Field, InputType, Int} from "type-graphql";
import type {HeroAscendancy} from "../models/hero-ascendancy";
import * as jf from "joiful";

@InputType({description: "New hero ascendancy"})
class CreateAscendancyInput implements Pick<HeroAscendancy, "name" | "imageUrl"> {
    @Field(() => String)
    @jf.string().required().max(50)
    public name!: string;

    @Field(() => String, {nullable: true})
    @jf.string().optional().min(1).max(255).uri({allowRelative: false})
    public imageUrl!: string;

    @Field(() => Int)
    @jf.number().required().positive()
    public heroClassId!: number;
}

export {CreateAscendancyInput};
