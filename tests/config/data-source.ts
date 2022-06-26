import "dotenv/config";
import * as env from "env-var";
import {DataSource} from "typeorm";
import {HeroClass} from "../../src/heroes/hero-class/models/hero-class";
import {HeroAscendancy} from "../../src/heroes/hero-ascendancy/models/hero-ascendancy";
import {Container} from "typedi";

const entities = [HeroClass, HeroAscendancy];

const testDataSource = (refreshDb = false): DataSource =>
    new DataSource({
        database: env.get("TYPEORM_TEST_NAME").required().asString(),
        dropSchema: refreshDb,
        entities,
        host: env.get("TYPEORM_HOST").required().asString(),
        logging: false,
        name: env.get("TYPEORM_TEST_NAME").required().asString(),
        password: env.get("TYPEORM_PASSWORD").required().asString(),
        port: env.get("TYPEORM_PORT").required().asPortNumber(),
        synchronize: refreshDb,
        type: env.get("TYPEORM_TYPE").default("mysql").asEnum(["mysql", "postgres"]),
        username: env.get("TYPEORM_USERNAME").required().asString()
    });

const initializeDataSource = async (): Promise<DataSource> => {
    const dataSource = testDataSource(false);

    // Initialize the data source and store it in the container. Required for the dependency injection.
    await dataSource
        .initialize()
        .then(async () => dataSource.synchronize(false))
        .then(() => Container.set(DataSource, dataSource));

    return dataSource;
};

export {testDataSource, initializeDataSource};
