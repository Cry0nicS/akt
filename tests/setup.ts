import {testDataSource} from "./config/data-source";

/**
 * Executed once, before running the test case in order to refresh the database.
 */
(async (): Promise<void> => {
    const dataSource = testDataSource(true);
    // Drops the database and recreates it based on the existing entities.
    await dataSource
        .initialize()
        .then(async () => dataSource.synchronize(true))
        .then(() => {
            // eslint-disable-next-line no-console -- Okay in this context.
            console.dir("Data Source has been refreshed!");
        })
        // eslint-disable-next-line no-process-exit -- Required, for now, to exit the process.
        .then(() => process.exit());

    // TODO: Load base fixtures.
})().catch((e) => {
    // eslint-disable-next-line no-console -- Okay in this context.
    console.error("Error while refreshing the database:", e);
});
