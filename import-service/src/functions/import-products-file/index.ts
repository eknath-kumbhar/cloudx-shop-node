import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        responses: {
          200: {
            description: 'This is a success response',
            bodyType: 'string'
          },
          500: {
            description: 'This is a error response',
            bodyType: 'string'
          }
        }
      },
    },
  ],
};
