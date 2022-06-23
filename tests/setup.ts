import {DataSourceService} from "../src/app/config/data-source-bk";
import {Container} from "typedi";
import * as env from "env-var";

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

Container.set("data-source", dataSource);
