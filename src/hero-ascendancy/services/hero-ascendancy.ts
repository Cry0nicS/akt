import {Service} from "typedi";
import {HeroAscendancyRepository} from "../repositories/hero-ascendancy";
import {HeroAscendancy} from "../models/hero-ascendancy";
import {HeroClassService} from "../../hero-class/services/hero.class";
import type {CreateAscendancyInput} from "../types/create-ascendancy";

@Service()
class HeroAscendancyService {
    private readonly heroAscendancyRepository: HeroAscendancyRepository;
    private readonly heroClassService: HeroClassService;

    public constructor(
        heroAscendancyRepository: HeroAscendancyRepository,
        heroClassService: HeroClassService
    ) {
        this.heroAscendancyRepository = heroAscendancyRepository;
        this.heroClassService = heroClassService;
    }

    public async create(data: CreateAscendancyInput): Promise<HeroAscendancy> {
        const heroAscendancy = Object.assign(new HeroAscendancy(), data);
        heroAscendancy.heroClass = await this.heroClassService.findOneById(data.heroClassId);

        return this.heroAscendancyRepository.save(heroAscendancy);
    }

    public async delete(id: number): Promise<boolean> {
        const heroAscendancy = await this.heroAscendancyRepository.findOneBy({id});

        if (!heroAscendancy) {
            throw new Error(`Hero ascendancy with ID "${id.toString()}" could not be found`);
        }

        await this.heroAscendancyRepository.remove(heroAscendancy);

        return true;
    }
}

export {HeroAscendancyService};
