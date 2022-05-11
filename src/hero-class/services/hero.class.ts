import {HeroClass} from "../models/hero-class";

class HeroClassService {
    public create(data: Partial<HeroClass>): HeroClass {
        return Object.assign(new HeroClass(), data);
    }
}

export {HeroClassService};
