import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        responses: {
          200: {
            description: 'This is a success response',
            bodyType: 'Product'
          },
          404: {
            description: 'This is a Error response'
          }
        }
      },
    },
  ],
};
