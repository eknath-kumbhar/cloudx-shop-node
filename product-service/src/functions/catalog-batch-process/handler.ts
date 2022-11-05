import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductService } from 'src/product.service';

export const catalogBatchProcess = async (event) => {
  try {
    const productService = new ProductService();
    const { Records: records } = event;
    const products = records.reduce((previousValue: Array<any>, currentValue: any) => [...previousValue, ...(JSON.parse(currentValue.body))], [])
    await Promise.all(products.map((product: Array<any>) => productService.insertProduct(product)))
    await productService.publishToTopic('New Product/s created')
    return formatJSONResponse({ message: 'products created' }, 200);
  } catch (error) {
    return formatJSONResponse({ message: 'Something Went Wrong, Please try again later!' }, 500);
  }
};

export const main = middyfy(catalogBatchProcess);
