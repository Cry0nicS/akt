import type Koa from "koa";

interface Context extends Koa.Context {
    activeUserId?: string;
}

export type {Context};
