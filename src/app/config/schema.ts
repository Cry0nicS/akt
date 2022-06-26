import {buildSchema} from "type-graphql";
import {Container} from "typedi";
import {HeroClassResolver} from "../../heroes/hero-class/resolvers/hero-class";
import {HeroAscendancyResolver} from "../../heroes/hero-ascendancy/resolvers/hero-ascendancy";
import type {GraphQLSchema} from "graphql";

// Constant tuple, not a mutable array.
const resolvers = [HeroClassResolver, HeroAscendancyResolver] as const;

const createSchema = async (): Promise<GraphQLSchema> =>
    buildSchema({
        container: Container, // Register TypeDi container.
        resolvers
    });

export {createSchema};
