import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {CreateAscendancyInput} from "../types/create-ascendancy";
import {HeroAscendancyResult} from "../types/result-type";
import {HeroAscendancyService} from "../services/hero-ascendancy";
import {HeroAscendancy} from "../models/hero-ascendancy";
import {HeroClassService} from "../../hero-class/services/hero-class";
import {Service} from "typedi";
import {SuccessOrError} from "../../../app/utils/types/result-type";

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

    @Query(() => HeroAscendancy, {nullable: true})
    public async heroAscendancy(@Arg("id") id: number): Promise<HeroAscendancy | null> {
        return this.heroAscendancyService.findOneById(id);
    }

    @Mutation(() => HeroAscendancyResult)
    public async createHeroAscendancy(
        @Arg("data") data: CreateAscendancyInput
    ): Promise<typeof HeroAscendancyResult> {
        return this.heroAscendancyService.create(data);
    }

    @Mutation(() => SuccessOrError)
    public async deleteHeroAscendancy(@Arg("id") id: number): Promise<typeof SuccessOrError> {
        return this.heroAscendancyService.delete(id);
    }
}

export {HeroAscendancyResolver};
