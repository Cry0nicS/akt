import type {DataSource} from "typeorm";
import type {HeroClass} from "../../src/heroes/hero-class/models/hero-class";
import {faker} from "@faker-js/faker";
import {gqlHelper} from "../gql-helper";
import {initializeDataSource} from "../config/data-source";
import {HeroClassService} from "../../src/heroes/hero-class/services/hero-class";
import {Container} from "typedi";

let dataSource: DataSource;
let heroClassService: HeroClassService;

beforeAll(async (): Promise<DataSource> => {
    dataSource = await initializeDataSource();
    heroClassService = Container.get(HeroClassService);

    return dataSource;
});

afterAll(async () => dataSource.destroy());

const createHeroClass = `
    mutation CreateHeroClass($name: String!, $imageUrl: String) {
      createHeroClass(name: $name, imageUrl: $imageUrl) {
        id
        name,
        imageUrl
      }
    }
`;

const deleteHeroClass = `
    mutation DeleteHeroClass($heroClassId: Float!) {
      deleteHeroClass(id: $heroClassId)
    }
`;

const findHeroClass = `
    query HeroClass($heroClassId: Float!) {
      heroClass(id: $heroClassId) {
        id
        name
        imageUrl
      }
    }
`;

describe("Hero class", () => {
    it("should create a hero class", async () => {
        const heroClass: Partial<HeroClass> = {
            name: faker.name.jobType(),
            imageUrl: faker.image.imageUrl()
        };

        const response = await gqlHelper({
            source: createHeroClass,
            variableValues: heroClass
        });

        expect(response).toMatchObject({
            data: {
                createHeroClass: heroClass
            }
        });
    });

    it("should find existing hero class", async () => {
        const heroClass = await heroClassService.create({
            name: faker.random.word(),
            imageUrl: faker.image.imageUrl()
        });

        const response = await gqlHelper({
            source: findHeroClass,
            variableValues: {
                heroClassId: heroClass.id
            }
        });

        expect(response).toMatchObject({
            data: {
                heroClass
            }
        });
    });

    it("should find all existing hero classes", async () => {
        const heroClass1 = await heroClassService.create({
            name: faker.random.word(),
            imageUrl: faker.image.imageUrl()
        });

        const heroClass2 = await heroClassService.create({
            name: faker.random.word(),
            imageUrl: faker.image.imageUrl()
        });

        const response = await gqlHelper({
            source: `
                query HeroClasses {
                  heroClasses {
                    id
                    name
                    imageUrl
                  }
                }
            `
        });

        expect(response.data?.["heroClasses"]).toEqual(
            expect.arrayContaining([heroClass1, heroClass2])
        );
    });

    it("should delete a hero class", async () => {
        const heroClass = await heroClassService.create({
            name: faker.random.word(),
            imageUrl: faker.image.imageUrl()
        });

        const response = await gqlHelper({
            source: deleteHeroClass,
            variableValues: {
                heroClassId: heroClass.id
            }
        });

        expect(response).toMatchObject({
            data: {
                deleteHeroClass: true
            }
        });
    });
});
