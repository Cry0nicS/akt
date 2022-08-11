import {createUnionType} from "type-graphql";
import {BaseError} from "../../../app/utils/errors/base-error";
import {HeroAscendancy} from "../models/hero-ascendancy";

// eslint-disable-next-line @typescript-eslint/naming-convention
const HeroAscendancyResult = createUnionType({
    name: "HeroAscendancyResult",
    types: () => [HeroAscendancy, BaseError],
    resolveType: (value) => {
        if ("message" in value) {
            return BaseError;
        }

        if ("id" in value) {
            return HeroAscendancy;
        }

        return undefined;
    }
});

export {HeroAscendancyResult};
