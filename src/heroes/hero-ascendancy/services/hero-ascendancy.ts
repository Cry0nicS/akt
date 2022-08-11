import type {CreateAscendancyInput} from "../types/create-ascendancy";
import type {HeroAscendancyResult} from "../types/result-type";
import type {SuccessOrError} from "../../../app/utils/types/result-type";
import {HeroAscendancyRepository} from "../repositories/hero-ascendancy";
import {HeroAscendancy} from "../models/hero-ascendancy";
import {HeroClassService} from "../../hero-class/services/hero-class";
import {isHeroClass} from "../../hero-class/services/result-type";
import {NotFoundError} from "../../../app/utils/errors/not-found-error";
import {Service} from "typedi";
import {SuccessfulResponse} from "../../../app/utils/success/successful-response";

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

    public async findAll(): Promise<HeroAscendancy[]> {
        return this.heroAscendancyRepository.findAll();
    }

    public async findOneById(id: number): Promise<HeroAscendancy | null> {
        return this.heroAscendancyRepository.findOneById(id);
    }

    public async create(data: CreateAscendancyInput): Promise<typeof HeroAscendancyResult> {
        const heroAscendancy = Object.assign(new HeroAscendancy(), data);

        const result = await this.heroClassService.getOneById(data.heroClassId);

        if (!isHeroClass(result)) {
            return result;
        }

        heroAscendancy.heroClass = result;

        return this.heroAscendancyRepository.save(heroAscendancy);
    }

    public async delete(id: number): Promise<typeof SuccessOrError> {
        const heroAscendancy = await this.heroAscendancyRepository.findOneBy({id});

        if (!heroAscendancy) {
            return new NotFoundError("Hero ascendancy", "id", id.toString());
        }

        await this.heroAscendancyRepository.remove(heroAscendancy);

        return new SuccessfulResponse("Hero ascendancy successfully deleted", true, 200);
    }
}

export {HeroAscendancyService};
