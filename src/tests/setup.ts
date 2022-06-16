import {testDataSource} from "../app/config/data-source";

void testDataSource(true)
    .initialize()
    // eslint-disable-next-line no-process-exit -- Okay in this context.
    .then(() => process.exit())
    .catch((e) => {
        // eslint-disable-next-line no-console -- Okay in this context.
        console.error("Error during exiting test data source", e);
    });
