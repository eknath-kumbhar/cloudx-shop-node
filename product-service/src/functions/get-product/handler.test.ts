import { getProductsById } from './handler';
import ProductsData from "src/assets/products.json";

describe('getProductList', () => {
    it('should return correct successful response', async () => {
        const mockEvent = {
            pathParameters: {
                productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
            },
        }
        const result = await getProductsById(mockEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body)).toEqual(ProductsData[0]);
    });

    it('should return 404 response', async () => {
        const mockEvent = {
            pathParameters: {
                productId: '1234',
            },
        }
        const result = await getProductsById(mockEvent);
        expect(result.statusCode).toEqual(404);
    });
});