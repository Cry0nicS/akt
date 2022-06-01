import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {HeroClassService} from "../services/hero-class";
import {HeroClass} from "../models/hero-class";
import {Service} from "typedi";

@Service()
@Resolver(() => HeroClass)
class HeroClassResolver {
    private readonly heroClassService: HeroClassService;

    public constructor(heroClassService: HeroClassService) {
        this.heroClassService = heroClassService;
    }

    @Query(() => [HeroClass])
    public async heroClasses(): Promise<HeroClass[]> {
        return this.heroClassService.findAll();
    }

    @Query(() => HeroClass, {nullable: true})
    public async heroClass(@Arg("id") id: number): Promise<HeroClass | null> {
        return this.heroClassService.findOneById(id);
    }

    @Mutation(() => HeroClass)
    public async createHeroClass(
        @Arg("name") name: string,
        @Arg("imageUrl", {nullable: true}) imageUrl?: string
    ): Promise<HeroClass> {
        return this.heroClassService.create({name, imageUrl});
    }

    @Mutation(() => Boolean)
    public async deleteHeroClass(@Arg("id") id: number): Promise<boolean> {
        return this.heroClassService.delete(id);
    }
}

export {HeroClassResolver};
