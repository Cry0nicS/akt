import {dataSource} from "../../app/data-source";
import {HeroClass} from "../models/hero-class";
import {Service} from "typedi";

@Service()
class HeroClassRepository {
    private readonly heroClassRepository = dataSource.getRepository(HeroClass);

    public async getHeroClasses(): Promise<HeroClass[]> {
        return this.heroClassRepository.find({
            relations: {
                heroAscendancies: true
            }
        });
    }

    public async getHeroClass(id: number): Promise<HeroClass | null> {
        return this.heroClassRepository
            .createQueryBuilder("hc")
            .leftJoinAndSelect("hc.heroAscendancies", "ha")
            .where("hc.id = :id", {id})
            .getOne();
    }
}

export {HeroClassRepository};
