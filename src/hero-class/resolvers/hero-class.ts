import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {HeroClassRepository} from "../repositories/hero-class";
import {HeroClassService} from "../services/hero.class";
import {HeroClass} from "../models/hero-class";
import {Service} from "typedi";

@Service()
@Resolver(() => HeroClass)
class HeroClassResolver {
    private readonly heroClassService: HeroClassService;
    private readonly heroClassRepository: HeroClassRepository;

    public constructor(
        heroClassService: HeroClassService,
        heroClassRepository: HeroClassRepository
    ) {
        this.heroClassService = heroClassService;
        this.heroClassRepository = heroClassRepository;
    }

    @Query(() => [HeroClass])
    public async heroClasses(): Promise<HeroClass[]> {
        return this.heroClassRepository.getHeroClasses();
    }

    @Query(() => HeroClass, {nullable: true})
    public async heroClass(@Arg("id") id: number): Promise<HeroClass | null> {
        return this.heroClassService.getOneById(id);
    }

    @Mutation(() => HeroClass)
    public async create(
        @Arg("name") name: string,
        @Arg("imageUrl", {nullable: true}) imageUrl?: string
    ): Promise<HeroClass> {
        return this.heroClassService.create({name, imageUrl});
    }

    @Mutation(() => Boolean)
    public async delete(@Arg("id") id: number): Promise<boolean> {
        return this.heroClassService.delete(id);
    }
}

export {HeroClassResolver};
