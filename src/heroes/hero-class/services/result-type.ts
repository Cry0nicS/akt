import {createUnionType} from "type-graphql";
import {BaseError} from "../../../app/utils/errors/base-error";
import {HeroClass} from "../models/hero-class";

// eslint-disable-next-line @typescript-eslint/naming-convention
const HeroClassResult = createUnionType({
    name: "HeroClassResult",
    types: () => [HeroClass, BaseError],
    resolveType: (value) => {
        if ("message" in value) {
            return BaseError;
        }

        if ("id" in value) {
            return HeroClass;
        }

        return undefined;
    }
});

// Type guards.
const isHeroClass = (result: typeof HeroClassResult): result is HeroClass =>
    result.id !== undefined;

export {isHeroClass, HeroClassResult};
