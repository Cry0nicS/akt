import {buildSchema, BuildSchemaOptions} from "type-graphql";
import {Container} from "typedi";
import {HeroClassResolver} from "../../heroes/hero-class/resolvers/hero-class";
import {HeroAscendancyResolver} from "../../heroes/hero-ascendancy/resolvers/hero-ascendancy";
import type {GraphQLSchema} from "graphql";
import type {DataSource} from "typeorm";

// Constant tuple, not a mutable array.
const resolvers = [HeroClassResolver, HeroAscendancyResolver] as const;

const createSchema = async (dataSource: DataSource): Promise<GraphQLSchema> => {
    Container.set("data-source", dataSource);

    return buildSchema({
        container: Container, // Register TypeDi container.
        resolvers
    });
};

export {createSchema};
