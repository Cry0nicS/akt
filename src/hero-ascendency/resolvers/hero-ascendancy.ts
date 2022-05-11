import {Arg, FieldResolver, Query, Resolver, Root} from "type-graphql";
import {HeroAscendancy} from "../models/hero-ascendancy";
import {dataSource} from "../../app/data-source";
import {HeroClass} from "../../hero-class/models/hero-class";
import {Repository} from "typeorm";

@Resolver(() => HeroClass)
class HeroAscendancyResolver {
    private readonly heroClassRepository: Repository<HeroClass>;

    public constructor(heroClassRepository: Repository<HeroClass>) {
        this.heroClassRepository = heroClassRepository;
    }

    @Query(() => [HeroAscendancy])
    public async heroAscendancies(): Promise<HeroAscendancy[]> {
        return dataSource.manager.find(HeroAscendancy);
    }

    @Query(() => HeroAscendancy)
    public async heroAscendancy(
        @Arg("id", {nullable: true}) id: number
    ): Promise<HeroAscendancy | null> {
        return dataSource.manager.findOneBy(HeroAscendancy, {id});
    }

    @FieldResolver(() => HeroClass)
    public async heroClass(@Root() heroAscendancy: HeroAscendancy): Promise<HeroClass> {
        const heroClass = await this.heroClassRepository.findOneBy({
            id: heroAscendancy.heroClass.id
        });

        if (heroClass === null) throw new Error("Something somewhere went terribly wrong.");

        return heroClass;
    }
}

export {HeroAscendancyResolver};
