import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductService } from 'src/product.service';

export const getProductsList = async () => {
  try {
    const productService = new ProductService();
    return formatJSONResponse(await productService.getProducts(), 200);
  } catch (error) {
    return formatJSONResponse({ message: error.message || 'error' }, 500);
  }
};

export const main = middyfy(getProductsList);
