import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const inputDto = {
            name: "Product 1",
            price: 1,
        };

        const response = await request(app)
            .post("/product")
            .send(inputDto);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(inputDto.name);
        expect(response.body.price).toBe(inputDto.price);
    });

    it("should not create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
            });

        expect(response.status).toBe(500);
    });

    it("should list all product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 1,
            });

        expect(response.status).toBe(200);
        
        const response2 = await request(app)
            .post("/product")
            .send({
                name: "Product 2",
                price: 2,
            });

        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/product").send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);

        const product = listResponse.body.products[0];
        expect(product.name).toBe("Product 1");
        expect(product.price).toBe(1);

        const product2 = listResponse.body.products[1];
        expect(product2.name).toBe("Product 2");
        expect(product2.price).toBe(2);
    });

    it("should find a product", async () => {
        const inputDto = {
            name: "Product 1",
            price: 1,
        };

        const postResponse = await request(app)
        .post("/product")
        .send(inputDto);

        expect(postResponse.status).toBe(200);

        const { id } = postResponse.body;

        const getResponse = await request(app)
        .get(`/product/${id}`);

        expect(getResponse.status).toBe(200);
        expect(getResponse.body.name).toBe(inputDto.name);
        expect(getResponse.body.price).toBe(inputDto.price);
    });

    it("should update a product", async () => {
        const inputDto = {
            name: "Product 1",
            price: 1,
        };

        const postResponse = await request(app)
        .post("/product")
        .send(inputDto);

        expect(postResponse.status).toBe(200);

        const { id } = postResponse.body;

        const updateDto = {
            name: "Product 2",
            price: 1,
        }

        const updateResponse = await request(app)
        .put(`/product/${id}`)
        .send(updateDto);

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.id).toBe(id);
        expect(updateResponse.body.name).toBe(updateDto.name);
        expect(updateResponse.body.price).toBe(updateDto.price);
    });
});