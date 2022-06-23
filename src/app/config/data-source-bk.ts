import "dotenv/config";
import * as env from "env-var";
import type {DataSourceOptions} from "typeorm";
import {DataSource} from "typeorm";
import {HeroAscendancy} from "../../heroes/hero-ascendancy/models/hero-ascendancy";
import {HeroClass} from "../../heroes/hero-class/models/hero-class";
import {Container, Service} from "typedi";

@Service()
class DataSourceService {
    private readonly entities = [HeroClass, HeroAscendancy];

    public createDataSource = (nodeEnv: string, dropSchema?: boolean): DataSource => {
        if (nodeEnv === "test") {
            return new DataSource(this.testOptions(dropSchema));
        }

        return new DataSource(this.developmentOptions());
    };

    public getDataSource = (): DataSource => Container.get("data-source");

    private readonly developmentOptions = (): DataSourceOptions => ({
        database: env.get("TYPEORM_NAME").required().asString(),
        entities: this.entities,
        host: env.get("TYPEORM_HOST").required().asString(),
        logging: true,
        name: env.get("TYPEORM_NAME").required().asString(),
        password: env.get("TYPEORM_PASSWORD").required().asString(),
        port: env.get("TYPEORM_PORT").required().asPortNumber(),
        synchronize: true,
        type: env.get("TYPEORM_TYPE").default("mysql").asEnum(["mysql", "postgres"]),
        username: env.get("TYPEORM_USERNAME").required().asString()
    });

    private readonly testOptions = (dropSchema = false): DataSourceOptions => ({
        database: env.get("TYPEORM_TEST_NAME").required().asString(),
        dropSchema,
        entities: this.entities,
        host: env.get("TYPEORM_HOST").required().asString(),
        logging: false,
        name: env.get("TYPEORM_TEST_NAME").required().asString(),
        password: env.get("TYPEORM_PASSWORD").required().asString(),
        port: env.get("TYPEORM_PORT").required().asPortNumber(),
        synchronize: dropSchema,
        type: env.get("TYPEORM_TYPE").default("mysql").asEnum(["mysql", "postgres"]),
        username: env.get("TYPEORM_USERNAME").required().asString()
    });
}

export {DataSourceService};
