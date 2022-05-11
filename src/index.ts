import "dotenv/config";
import "reflect-metadata";
import * as env from "env-var";
import http from "http";
import Koa from "koa";
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core";
import {ApolloServer} from "apollo-server-koa";
import {buildSchema} from "type-graphql";
import {Container} from "typedi";
import {HeroAscendancyResolver} from "./hero-ascendency/resolvers/hero-ascendancy";
import {HeroClassResolver} from "./hero-class/resolvers/hero-class";

(async (): Promise<void> => {
    const httpServer = http.createServer();

    const server = new ApolloServer({
        debug: true,
        schema: await buildSchema({
            container: Container, // Register TypeDi container.
            resolvers: [HeroClassResolver, HeroAscendancyResolver]
        }),
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
