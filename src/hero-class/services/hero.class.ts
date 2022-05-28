import {HeroClass} from "../models/hero-class";
import {Service} from "typedi";
import {HeroClassRepository} from "../repositories/hero-class";

@Service()
class HeroClassService {
    private readonly heroClassRepository: HeroClassRepository;

    public constructor(heroClassRepository: HeroClassRepository) {
        this.heroClassRepository = heroClassRepository;
    }

    public async create(data: Partial<HeroClass>): Promise<HeroClass> {
        const heroClass = Object.assign(new HeroClass(), data);

        return this.heroClassRepository.save(heroClass);
    }

    public async findOneById(id: number): Promise<HeroClass> {
        const heroClass = await this.heroClassRepository.getHeroClass(id);

        if (!heroClass) throw new Error(`Hero class with ID "${id.toString()}" not found`);

        return heroClass;
    }

    public async getOneById(id: number): Promise<HeroClass | null> {
        return this.heroClassRepository.getHeroClass(id);
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
