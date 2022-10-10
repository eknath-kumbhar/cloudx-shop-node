import { ProductsData } from "../../products.mock";
import { getProductsList } from './handler';

describe('getProductList', () => {
    it('should return correct successful response', async () => {
        const result = await getProductsList();
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body)).toEqual(ProductsData);
    });
});