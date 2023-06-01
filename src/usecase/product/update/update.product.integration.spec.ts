import { Sequelize } from "sequelize-typescript";
import UpdateProductUseCase from "./update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Unit test for product update use case", () => {
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

    it("should update a product", async () => {
        const productRepository = new ProductRepository();

        const createProductUseCase = new CreateProductUseCase(productRepository);
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        const product = await createProductUseCase.execute({
            name: "Product 1",
            price: 1,
        });

        const input = {
            id: product.id,
            name: "Product Updated",
            price: 2,
        }

        const output = await productUpdateUseCase.execute(input);

        expect(output).toEqual(input);
    });
})