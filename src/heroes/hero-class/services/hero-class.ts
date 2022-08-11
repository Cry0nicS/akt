import type {HeroClassResult} from "./result-type";
import type {SuccessOrError} from "../../../app/utils/types/result-type";
import {HeroClassRepository} from "../repositories/hero-class";
import {HeroClass} from "../models/hero-class";
import {NotFoundError} from "../../../app/utils/errors/not-found-error";
import {Service} from "typedi";
import {SuccessfulResponse} from "../../../app/utils/success/successful-response";

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
     *  Thrown if the hero class does not exist.
     */
    public async getOneById(id: number): Promise<typeof HeroClassResult> {
        const heroClass = await this.heroClassRepository.findOneById(id);

        if (!heroClass) return new NotFoundError("Hero class", "id", id.toString());

        return heroClass;
    }

    /**
     *  Find methods return the desired entity, or null if this does not exist.
     */
    public async findOneById(id: number): Promise<HeroClass | null> {
        return this.heroClassRepository.findOneById(id);
    }

    public async delete(id: number): Promise<typeof SuccessOrError> {
        const heroClass = await this.heroClassRepository.findOneById(id);

        if (!heroClass) return new NotFoundError("Hero class", "id", id.toString());

        await this.heroClassRepository.remove(heroClass);

        return new SuccessfulResponse("Hero class successfully deleted", true, 200);
    }
}

export {HeroClassService};
