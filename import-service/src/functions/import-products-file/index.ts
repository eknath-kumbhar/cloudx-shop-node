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
        },
        authorizer: {
          arn: 'arn:aws:lambda:ap-south-1:059012808184:function:authorization-service-dev-basicAuthorizer',
          name: 'basicAuthorizer',
          type: 'TOKEN',
          identitySource: 'method.request.header.Authorization',
        }
      },
    },
  ],
};
