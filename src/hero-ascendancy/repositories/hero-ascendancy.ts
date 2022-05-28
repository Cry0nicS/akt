import {dataSource} from "../../app/data-source";
import {HeroAscendancy} from "../models/hero-ascendancy";
import {Service} from "typedi";
import {Repository} from "typeorm";

@Service()
class HeroAscendancyRepository extends Repository<HeroAscendancy> {
    private readonly heroAscendancyRepository = dataSource.getRepository(HeroAscendancy);

    public async findAll(): Promise<HeroAscendancy[]> {
        return this.heroAscendancyRepository.find({
            relations: {heroClass: true}
        });
    }

    public override async findOneById(id: number): Promise<HeroAscendancy> {
        const heroAscendancy = await this.heroAscendancyRepository.findOneBy({id});

        if (!heroAscendancy)
            throw new Error(`Hero ascendancy with ID "${id.toString()}" not found`);

        return heroAscendancy;
    }
}

export {HeroAscendancyRepository};
