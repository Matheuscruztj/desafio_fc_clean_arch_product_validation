import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import FindProductUseCase from "./find.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";

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
        const productRepository = new ProductRepository();

        const createProductUseCase = new CreateProductUseCase(productRepository)
        const findProductUseCase = new FindProductUseCase(productRepository);

        const { id } = await createProductUseCase.execute({
            name: "Product 1",
            price: 1,
        });

        const input = {
            id,
        }

        const output = {
            id,
            name: "Product 1",
            price: 1,
        }

        const result = await findProductUseCase.execute(input);

        expect(result).toEqual(output);
    });

    it("should not find a product", async () => {
        const productRepository = new ProductRepository();

        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: "123",
        }

        expect(() => {
            return usecase.execute(input)
        }).rejects.toThrow("Product not found");
    });
});