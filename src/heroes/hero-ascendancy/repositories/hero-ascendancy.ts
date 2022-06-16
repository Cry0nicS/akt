import {dataSource} from "../../../app/config/data-source";
import {HeroAscendancy} from "../models/hero-ascendancy";
import {Service} from "typedi";
import {Repository} from "typeorm";

@Service()
class HeroAscendancyRepository extends Repository<HeroAscendancy> {
    private readonly heroAscendancyRepository = dataSource.getRepository(HeroAscendancy);

    public constructor() {
        super(HeroAscendancy, dataSource.manager);
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
