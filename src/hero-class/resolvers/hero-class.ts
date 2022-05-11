import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {HeroClass} from "../models/hero-class";
import {dataSource} from "../../app/data-source";
import {HeroClassService} from "../services/hero.class";
import {Repository} from "typeorm";

@Resolver(() => HeroClass)
class HeroClassResolver {
    private readonly heroClassService: HeroClassService;
    private readonly heroClassRepository: Repository<HeroClass>;

    public constructor(
        heroClassService: HeroClassService,
        heroClassRepository: Repository<HeroClass>
    ) {
        this.heroClassService = heroClassService;
        this.heroClassRepository = heroClassRepository;
    }

    @Query(() => [HeroClass])
    public async heroClasses(): Promise<HeroClass[]> {
        return dataSource.manager.find(HeroClass);
    }

    @Query(() => HeroClass)
    public async heroClass(@Arg("id") id: number): Promise<HeroClass | null> {
        return dataSource.manager.findOneBy(HeroClass, {id});
    }

    @Mutation(() => HeroClass)
    public async create(
        @Arg("name") name: string,
        @Arg("imageUrl") imageUrl: string
    ): Promise<HeroClass> {
        const heroClass = this.heroClassService.create({name, imageUrl});

        return this.heroClassRepository.save(heroClass);
    }

    @Mutation(() => Boolean)
    public async delete(@Arg("id") id: number): Promise<boolean> {
        const heroClass = await HeroClass.findOneByOrFail({id});
        await heroClass.remove();

        return true;
    }
}

export {HeroClassResolver};
