import {Arg, Query, Resolver} from "type-graphql";
import {HeroClass} from "../types/HeroClass";
import casual from "casual";

@Resolver()
class HeroClassResolver {
    public readonly heroClassCollection: HeroClass[] = [
        {
            id: casual.integer(1, 50),
            name: casual.name,
            imageUrl: casual.url
        },
        {
            id: casual.integer(1, 50),
            name: casual.name,
            imageUrl: casual.url
        }
    ];

    // TODO: Simulated await. Will be replaced once TypeORM and a DB is added. Re-enable eslint.
    @Query(() => [HeroClass])
    public async heroClasses(@Arg("name", {nullable: true}) name: string): Promise<HeroClass[]> {
        if (name) {
            // eslint-disable-next-line
            return await this.heroClassCollection.filter((hero) => hero.name === name);
        }

        // eslint-disable-next-line
        return await this.heroClassCollection;
    }
}

export {HeroClassResolver};
