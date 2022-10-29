import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import bodySchema from './schema';
import { ProductService } from 'src/product.service'

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  try {
    const productService = new ProductService();
    return formatJSONResponse(await productService.insertProduct(event.body), 201);
  } catch (error) {
    return formatJSONResponse({ message: 'Something Went Wrong, Please try again later!' }, 500);
  }
};

export const main = middyfy(createProduct);
