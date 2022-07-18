import "dotenv/config";
import "reflect-metadata";
import env from "env-var";
import http from "http";
import Koa from "koa";
import type {Context} from "./app/utils/interfaces/context";
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core";
import {ApolloServer} from "apollo-server-koa";
import {Container} from "typedi";
import {createSchema} from "./app/config/schema";
import {dataSource} from "./app/config/data-source";
import {DataSource} from "typeorm";

(async (): Promise<void> => {
    // Initialize TypeORM data-source.
    await dataSource
        .initialize()
        .then(() => {
            // eslint-disable-next-line no-console -- Okay in this context
            console.log("Initializing data source....!");
        })
        .then(() => {
            Container.set(DataSource, dataSource);
        })
        .then(() => {
            // eslint-disable-next-line no-console -- Okay in this context
            console.log("Data Source has been initialized!");
        })
        .catch((err) => {
            // eslint-disable-next-line no-console -- Okay in this context
            console.error("Error during Data Source initialization", err);
        });

    // Create a new Apollo server.
    const httpServer = http.createServer();
    const server = new ApolloServer({
        debug: true,
        schema: await createSchema(),
        plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
        csrfPrevention: true,
        cache: "bounded",
        context: ({ctx}: {ctx: Context}) => ctx
    });

    // Start has to be called before using the middleware integration.
    await server.start();

    // Configure Koa Middleware.
    const app = new Koa();
    app.proxy = true;

    app.use(
        server.getMiddleware({
            cors: {
                credentials: true,
                origin: (ctx: Context): string => {
                    const validDomains = [
                        "https://studio.apollographql.com",
                        "http://localhost:4000"
                    ];

                    if (
                        ctx.headers.origin !== undefined &&
                        validDomains.includes(ctx.headers.origin)
                    ) {
                        return ctx.headers.origin;
                    }

                    // Void is not valid, therefore we must return a default origin.
                    return validDomains[0];
                }
            }
        })
    );
    httpServer.on("request", app.callback());

    const port = env.get("APOLLO_PORT").required().asPortNumber();

    await new Promise<void>((resolve) => {
        httpServer.listen({port}, resolve);
    });

    // eslint-disable-next-line no-console -- Okay in this context
    console.log(`🚀 Server ready at http://localhost:${port.toString()}${server.graphqlPath}`);
})().catch((e: unknown) => {
    // eslint-disable-next-line no-console -- Okay in this context.
    console.error(e);
});
