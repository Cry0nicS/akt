import {graphql} from "graphql";
import {createSchema} from "../src/app/config/schema";
import type {ExecutionResult} from "graphql/execution/execute";
import type {GraphQLArgs} from "graphql/graphql";
import {Container} from "typedi";
import {DataSourceService} from "../src/app/config/data-source-bk";
import * as env from "env-var";

const gqlHelper = async ({
    source,
    variableValues
}: Pick<GraphQLArgs, "source" | "variableValues">): Promise<ExecutionResult> => {
    const dataSourceService = Container.get(DataSourceService);

    const dataSource = dataSourceService.createDataSource(
        env.get("APP_ENV").required().asString(),
        true
    );

    dataSource
        .initialize()
        // eslint-disable-next-line no-process-exit -- Okay in this context.
        .then(() => process.exit())
        .catch((e) => {
            // eslint-disable-next-line no-console -- Okay in this context.
            console.error("Error during exiting test data source", e);
        });

    return graphql({
        schema: await createSchema(dataSource),
        source,
        variableValues
    });
};

export {gqlHelper};
