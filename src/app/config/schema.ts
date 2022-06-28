import type {GraphQLSchema} from "graphql";
import {buildSchema} from "type-graphql";
import {Container} from "typedi";
import {HeroAscendancyResolver} from "../../heroes/hero-ascendancy/resolvers/hero-ascendancy";
import {HeroClassResolver} from "../../heroes/hero-class/resolvers/hero-class";
import {UserResolver} from "../../users/user/resolvers/user";

// Constant tuple, not a mutable array.
const resolvers = [HeroClassResolver, HeroAscendancyResolver, UserResolver] as const;

const createSchema = async (): Promise<GraphQLSchema> =>
    buildSchema({
        container: Container, // Register TypeDi container.
        resolvers
    });

export {createSchema};
