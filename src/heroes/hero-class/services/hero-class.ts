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

        // TODO: relations are not returned.
        return this.heroClassRepository.save(heroClass);
    }

    public async findAll(): Promise<HeroClass[]> {
        return this.heroClassRepository.findAll();
    }

    /**
     *  Get methods always returns the desired entity. If this does not exist, an error is thrown.
     *
     *  @throws {Error}
     *  Thrown if the hero class does not exist.
     */
    public async getOneById(id: number): Promise<HeroClass> {
        const heroClass = await this.heroClassRepository.findOneById(id);

        if (!heroClass) throw new Error(`Hero class with ID "${id.toString()}" not found.`);

        return heroClass;
    }

    /**
     *  Find methods return the desired entity, or null if this does not exist.
     */
    public async findOneById(id: number): Promise<HeroClass | null> {
        return this.heroClassRepository.findOneById(id);
    }

    public async delete(id: number): Promise<boolean> {
        const heroClass = await this.getOneById(id);

        await this.heroClassRepository.remove(heroClass);

        return true;
    }
}

export {HeroClassService};
