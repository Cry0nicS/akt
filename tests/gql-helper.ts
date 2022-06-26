import {graphql} from "graphql";
import {createSchema} from "../src/app/config/schema";
import type {ExecutionResult} from "graphql/execution/execute";
import type {GraphQLArgs} from "graphql/graphql";

const gqlHelper = async ({
    source,
    variableValues
}: Pick<GraphQLArgs, "source" | "variableValues">): Promise<ExecutionResult> =>
    graphql({
        schema: await createSchema(),
        source,
        variableValues
    });
export {gqlHelper};
