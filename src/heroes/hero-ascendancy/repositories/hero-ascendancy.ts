import {HeroAscendancy} from "../models/hero-ascendancy";
import {Service} from "typedi";
import {DataSource, Repository} from "typeorm";

@Service()
class HeroAscendancyRepository extends Repository<HeroAscendancy> {
    private readonly heroAscendancyRepository: Repository<HeroAscendancy>;

    public constructor(dataSource: DataSource) {
        super(HeroAscendancy, dataSource.manager);

        this.heroAscendancyRepository = dataSource.getRepository(HeroAscendancy);
    }

    public async findAll(): Promise<HeroAscendancy[]> {
        return this.heroAscendancyRepository.find({
            relations: {heroClass: true}
        });
    }

    public override async findOneById(id: number): Promise<HeroAscendancy | null> {
        return this.heroAscendancyRepository
            .createQueryBuilder("ha")
            .innerJoinAndSelect("ha.heroClass", "hc")
            .where("ha.id = :id", {id})
            .getOne();
    }
}

export {HeroAscendancyRepository};
