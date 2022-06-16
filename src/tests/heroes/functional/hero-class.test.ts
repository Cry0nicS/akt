import {testDataSource} from "../../../app/config/data-source";
import {gqlHelper} from "../../gql-helper";
import type {DataSource} from "typeorm";

let test: DataSource;
beforeAll(async () => {
    test = await testDataSource().initialize();
});

afterAll(async () => {
    await test.destroy();
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
