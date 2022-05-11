import {HeroClass} from "../models/hero-class";
import {Service} from "typedi";
import {dataSource} from "../../app/data-source";

@Service()
class HeroClassService {
    private readonly heroClassRepository = dataSource.getRepository(HeroClass);

    public async create(data: Partial<HeroClass>): Promise<HeroClass> {
        const heroClass = Object.assign(new HeroClass(), data);

        return this.heroClassRepository.save(heroClass);
    }

    public async delete(id: number): Promise<boolean> {
        const heroClass = await this.heroClassRepository.findOneBy({id});

        if (!heroClass) {
            throw new Error(`Hero class with ID "${id.toString()}" could not be found`);
        }

        await this.heroClassRepository.remove(heroClass);

        return true;
    }
}

export {HeroClassService};
