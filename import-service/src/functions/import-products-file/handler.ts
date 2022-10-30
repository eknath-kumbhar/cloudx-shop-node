import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ImportService } from 'src/import.service';
import schema from './schema';

const importProductsFileHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: any) => {
  let response: any;
  let statusCode = 200;
  try {
    const { name } = event.queryStringParameters;
    const importService = new ImportService();
    response = await importService.uploadToS3(name);
  } catch (error) {
    response = { message: 'Something Went Wrong, Please try again later!' };
    statusCode = 500
  }
  return formatJSONResponse(response, statusCode);
};

export const main = middyfy(importProductsFileHandler);
