import {dataSource} from "../../app/data-source";
import {HeroClass} from "../models/hero-class";
import {Service} from "typedi";
import {Repository} from "typeorm";

@Service()
class HeroClassRepository extends Repository<HeroClass> {
    private readonly heroClassRepository = dataSource.getRepository(HeroClass);

    public constructor() {
        super(HeroClass, dataSource.manager);
    }

    public async findAll(): Promise<HeroClass[]> {
        return this.heroClassRepository.find({
            relations: {
                heroAscendancies: true
            }
        });
    }

    public override async findOneById(id: number): Promise<HeroClass | null> {
        return this.heroClassRepository
            .createQueryBuilder("hc")
            .leftJoinAndSelect("hc.heroAscendancies", "ha")
            .where("hc.id = :id", {id})
            .getOne();
    }
}

export {HeroClassRepository};
