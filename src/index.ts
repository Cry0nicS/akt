import "reflect-metadata";
import http from "http";
import Koa from "koa";
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core";
import {ApolloServer} from "apollo-server-koa";
import {buildSchema} from "type-graphql";
import {HeroClassResolver} from "./hero-class/resolvers/HeroClass";

(async (): Promise<void> => {
    const httpServer = http.createServer();

    const server = new ApolloServer({
        debug: true,
        schema: await buildSchema({
            resolvers: [HeroClassResolver]
        }),
        plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
    });

    await server.start();
    const app = new Koa();
    app.use(server.getMiddleware());
    httpServer.on("request", app.callback());

    await new Promise<void>((resolve) => {
        httpServer.listen({port: 4000}, resolve);
    });

    // eslint-disable-next-line no-console -- Okay in this context
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})().catch((e: unknown) => {
    // eslint-disable-next-line no-console -- Okay in this context.
    console.error(e);
});
