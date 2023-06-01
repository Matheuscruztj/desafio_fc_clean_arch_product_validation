import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("123", "Product 1", 1);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Test find product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find a product", async () => {
        const productRepository = MockRepository();
        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: "123",
        }

        const output = {
            id: "123",
            name: "Product 1",
            price: 1,
        }

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });

    it("should not find a product", async () => {
        const productRepository = MockRepository();

        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found")
        })

        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: "123",
        }

        expect(() => {
            return usecase.execute(input)
        }).rejects.toThrow("Product not found");
    });
});