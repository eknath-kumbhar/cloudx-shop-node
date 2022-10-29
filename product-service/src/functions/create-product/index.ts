import { handlerPath } from '@libs/handler-resolver';
import bodySchema from './schema';


export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        request: {
          schemas: {
            'application/json': bodySchema,
          },
        },
        responses: {
          201: {
            description: 'This is a success response',
            bodyType: 'Product'
          },
          400: {
            description: 'This is a Error response - Invalid request body'
          },
          500: {
            description: 'This is a Error response - Internal Server Error'
          }
        }
      },
    },
  ],
};
