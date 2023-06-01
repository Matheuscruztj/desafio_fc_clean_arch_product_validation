import CreateProductUseCase from "./create.product.usecase";

const mockInput = {
    name: "Product 1",
    price: 1,
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
};

describe("Unit test create product use case", () => {
    it("should create a product", async () => {
        const productRepository = MockRepository();

        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const output = await productCreateUseCase.execute(mockInput);

        expect(output).toEqual({
            id: expect.any(String),
            name: mockInput.name,
            price: mockInput.price,
        })
    });

    it("should thrown an error when name is missing", async() => {
        const productRepository = MockRepository();
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
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        let input = {
            ...mockInput
        };

        input.price = -1;

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            new Error("product: Price must be greater than zero")
        );
    });

    it("should thrown an error when id and name are empty", async() => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        let input = {
            name: "",
            price: -1,
        };

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            new Error("product: Name is required,product: Price must be greater than zero")
        );
    });
});