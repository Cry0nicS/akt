import {gqlHelper} from "../../gql-helper";
import {Container} from "typedi";
import type {DataSource} from "typeorm";

const dataSource: DataSource = Container.get("data-source");

beforeAll(async () => {
    await dataSource.initialize();
});

afterAll(async () => {
    await dataSource.destroy();
});

const createHeroClass = `
    mutation CreateHeroClass($name: String!) {
      createHeroClass(name: $name) {
        id
        name
      }
    }
`;

describe("CreateHeroClass", () => {
    it("Create a hero class", async () => {
        // eslint-disable-next-line no-console -- Temporary.
        console.log(
            await gqlHelper({
                source: createHeroClass,
                variableValues: {
                    name: "Hello"
                }
            })
        );
    });
});
