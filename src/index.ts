import "dotenv/config";
import "reflect-metadata";
import * as env from "env-var";
import http from "http";
import Koa from "koa";
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core";
import {ApolloServer} from "apollo-server-koa";
import {createSchema} from "./app/config/schema";
import {dataSource} from "./app/config/data-source";

(async (): Promise<void> => {
    const httpServer = http.createServer();

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

    const server = new ApolloServer({
        debug: true,
        schema: await createSchema(),
        plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
    });

    await server.start();
    const app = new Koa();
    app.use(server.getMiddleware());
    httpServer.on("request", app.callback());

    const port = env.get("TYPEORM_PORT").required().asPortNumber();

    await new Promise<void>((resolve) => {
        httpServer.listen({port}, resolve);
    });

    // eslint-disable-next-line no-console -- Okay in this context
    console.log(`🚀 Server ready at http://localhost:${port.toString()}${server.graphqlPath}`);
})().catch((e: unknown) => {
    // eslint-disable-next-line no-console -- Okay in this context.
    console.error(e);
});
