import {User} from "../../users/user/models/user";
import {HeroClass} from "../../heroes/hero-class/models/hero-class";
import {HeroAscendancy} from "../../heroes/hero-ascendancy/models/hero-ascendancy";

// All entities are required by the ORM data-source.
const entities = [HeroAscendancy, HeroClass, User];

export {entities};
