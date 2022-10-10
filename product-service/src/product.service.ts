import { NoProductFound } from "./errors";
import { Product } from "./types/product";
import { ProductsData } from "./products.mock";

export class ProductService {
    constructor() {

    }

    async getProducts(): Promise<Array<Product>> {
        return Promise.resolve(ProductsData);
    }

    async getProductBy(productId: string): Promise<Product> {
        try {
            const product = ProductsData.find((res) => res.id === productId)
            this.checkIfProductExists(product);
            return Promise.resolve(product);
        } catch (error) {
            throw error;
        }
    }

    checkIfProductExists(product: any) {
        if (!product) {
            throw new NoProductFound()
        }
    }
}