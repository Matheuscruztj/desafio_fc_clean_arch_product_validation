import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

const mockInput = {
    name: "Product 1",
    price: 1,
};

describe("Unit test create product use case", () => {
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

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const output = await productCreateUseCase.execute(mockInput);

        expect(output).toEqual({
            id: expect.any(String),
            name: mockInput.name,
            price: mockInput.price,
        })
    });

    it("should thrown an error when name is missing", async() => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        let input = {
            ...mockInput
        };

        input.name = "";

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            new Error("product: Name is required")
        );
    });

    it("should thrown an error when price is negative", async() => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        let input = {
            ...mockInput
        };

        input.price = -1;

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            new Error("product: Price must be greater than zero")
        );
    });
});