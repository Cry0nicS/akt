import {Arg, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql";
import {HeroAscendancy} from "../models/hero-ascendancy";
import {dataSource} from "../../app/data-source";
import {HeroAscendancyRepository} from "../repositories/hero-ascendancy";
import {Service} from "typedi";
import {HeroAscendancyService} from "../services/hero-ascendancy";
import {CreateAscendancyInput} from "../types/create-ascendancy";
import type {HeroClass} from "../../hero-class/models/hero-class";
import {HeroClassService} from "../../hero-class/services/hero.class";

@Service()
@Resolver(() => HeroAscendancy)
class HeroAscendancyResolver {
    private readonly heroAscendancyRepository: HeroAscendancyRepository;
    private readonly heroAscendancyService: HeroAscendancyService;
    private readonly heroClassService: HeroClassService;

    public constructor(
        heroAscendancyRepository: HeroAscendancyRepository,
        heroAscendancyService: HeroAscendancyService,
        heroClassService: HeroClassService
    ) {
        this.heroAscendancyRepository = heroAscendancyRepository;
        this.heroAscendancyService = heroAscendancyService;
        this.heroClassService = heroClassService;
    }

    // TODO: move logic to a service.
    @Query(() => [HeroAscendancy])
    public async heroAscendancies(): Promise<HeroAscendancy[]> {
        return this.heroAscendancyRepository.findAll();
    }

    @Query(() => HeroAscendancy)
    public async heroAscendancy(
        @Arg("id", {nullable: true}) id: number
    ): Promise<HeroAscendancy | null> {
        return dataSource.manager.findOneBy(HeroAscendancy, {id});
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

    @FieldResolver()
    public async heroClass(@Root() heroAscendancy: HeroAscendancy): Promise<HeroClass> {
        return this.heroClassService.findOneById(heroAscendancy.heroClass.id);
    }
}

export {HeroAscendancyResolver};
