import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {HeroAscendancy} from "../models/hero-ascendancy";
import {Service} from "typedi";
import {HeroAscendancyService} from "../services/hero-ascendancy";
import {CreateAscendancyInput} from "../types/create-ascendancy";
import {HeroClassService} from "../../hero-class/services/hero-class";

@Service()
@Resolver(() => HeroAscendancy)
class HeroAscendancyResolver {
    private readonly heroAscendancyService: HeroAscendancyService;
    private readonly heroClassService: HeroClassService;

    public constructor(
        heroAscendancyService: HeroAscendancyService,
        heroClassService: HeroClassService
    ) {
        this.heroAscendancyService = heroAscendancyService;
        this.heroClassService = heroClassService;
    }

    @Query(() => [HeroAscendancy])
    public async heroAscendancies(): Promise<HeroAscendancy[]> {
        return this.heroAscendancyService.findAll();
    }

    @Query(() => HeroAscendancy)
    public async heroAscendancy(@Arg("id") id: number): Promise<HeroAscendancy | null> {
        return this.heroAscendancyService.findOneById(id);
    }

    @Mutation(() => HeroAscendancy)
    public async createHeroAscendancy(
        @Arg("data") data: CreateAscendancyInput
    ): Promise<HeroAscendancy> {
        return this.heroAscendancyService.create(data);
    }

    @Mutation(() => Boolean)
    public async deleteHeroAscendancy(@Arg("id") id: number): Promise<boolean> {
        return this.heroAscendancyService.delete(id);
    }
}

export {HeroAscendancyResolver};
