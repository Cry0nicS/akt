import "dotenv/config";
import * as env from "env-var";
import {DataSource} from "typeorm";
import {HeroAscendancy} from "../hero-ascendancy/models/hero-ascendancy";
import {HeroClass} from "../hero-class/models/hero-class";

const dataSource = new DataSource({
    type: env.get("TYPEORM_TYPE").default("mysql").asEnum(["mysql", "postgres"]),
    host: env.get("TYPEORM_HOST").required().asString(),
    port: env.get("TYPEORM_PORT").required().asPortNumber(),
    database: env.get("TYPEORM_NAME").required().asString(),
    username: env.get("TYPEORM_USERNAME").required().asString(),
    password: env.get("TYPEORM_PASSWORD").required().asString(),
    entities: [HeroClass, HeroAscendancy],
    synchronize: true,
    logging: true
});

dataSource
    .initialize()
    .then(() => {
        // eslint-disable-next-line no-console -- Okay in this context
        console.log("Initializing data source....!");
    })
    .then(() => {
        // eslint-disable-next-line no-console -- Okay in this context
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        // eslint-disable-next-line no-console -- Okay in this context
        console.error("Error during Data Source initialization", err);
    });

export {dataSource};
