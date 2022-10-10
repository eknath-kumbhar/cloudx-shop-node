import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { NO_PRDUCT_FOUND } from 'src/errors';
import { ProductService } from 'src/product.service';

import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let statusCode = 200;
  try {
    const productService = new ProductService();
    const { productId } = event.pathParameters;
    return formatJSONResponse(await productService.getProductBy(productId), statusCode);
  } catch (error) {
    statusCode = 500;
    if (error.message === NO_PRDUCT_FOUND) {
      statusCode = 404;
    }
    return formatJSONResponse({ message: error.message || 'error' }, statusCode);
  }
};

export const main = middyfy(getProductsById);
