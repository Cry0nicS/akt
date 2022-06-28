import "dotenv/config";
import env from "env-var";
import {DataSource} from "typeorm";
import {entities} from "./entities";

const dataSource = new DataSource({
    database: env.get("TYPEORM_NAME").required().asString(),
    dropSchema: false,
    entities,
    host: env.get("TYPEORM_HOST").required().asString(),
    logging: true,
    name: env.get("TYPEORM_NAME").required().asString(),
    password: env.get("TYPEORM_PASSWORD").required().asString(),
    port: env.get("TYPEORM_PORT").required().asPortNumber(),
    synchronize: true,
    type: env.get("TYPEORM_TYPE").default("mysql").asEnum(["mysql", "postgres"]),
    username: env.get("TYPEORM_USERNAME").required().asString()
});

export {dataSource};
