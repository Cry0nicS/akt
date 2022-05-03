import {Arg, Query, Resolver} from "type-graphql";
import {HeroClass} from "../models/hero-class";
import {dataSource} from "../../app/data-source";

@Resolver()
class HeroClassResolver {
    @Query(() => [HeroClass])
    public async heroClasses(): Promise<HeroClass[]> {
        return dataSource.manager.find(HeroClass);
    }

    @Query(() => HeroClass)
    public async heroClass(@Arg("id") id: number): Promise<HeroClass | null> {
        return dataSource.manager.findOneBy(HeroClass, {id});
    }
}

export {HeroClassResolver};
