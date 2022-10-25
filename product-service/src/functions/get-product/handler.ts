import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { NO_PRDUCT_FOUND } from 'src/errors';
import { ProductService } from 'src/product.service';

export const getProductsById = async (event) => {
  let statusCode = 200;
  try {
    const productService = new ProductService();
    const { productId } = event.pathParameters;
    return formatJSONResponse(await productService.getProductBy(productId), statusCode);
  } catch (error) {
    statusCode = 500;
    let message = 'Something Went Wrong, Please try again later!'
    if (error.message === NO_PRDUCT_FOUND) {
      message = error.message,
        statusCode = 404;
    }
    return formatJSONResponse({ message }, statusCode);
  }
};

export const main = middyfy(getProductsById);
