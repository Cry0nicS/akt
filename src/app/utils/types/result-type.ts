import {createUnionType} from "type-graphql";
import {BaseError} from "../errors/base-error";
import {SuccessfulResponse} from "../success/successful-response";

// eslint-disable-next-line @typescript-eslint/naming-convention
const SuccessOrError = createUnionType({
    name: "SuccessOrError",
    types: () => [SuccessfulResponse, BaseError],
    resolveType: (value) => {
        if ("success" in value) {
            return SuccessfulResponse;
        }

        return BaseError;
    }
});

export {SuccessOrError};
