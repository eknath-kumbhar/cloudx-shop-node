import type { AWS } from '@serverless/typescript';

import * as functions from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-dotenv-plugin', 'serverless-auto-swagger', 'serverless-esbuild', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-south-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem"
        ],
        Resource: [
          "arn:aws:dynamodb:ap-south-1:059012808184:table/products",
          "arn:aws:dynamodb:ap-south-1:059012808184:table/stocks"]
      },
      {
        Effect: "Allow",
        Action: ["sns:Publish"],
        Resource: ["arn:aws:sns:ap-south-1:059012808184:createProductTopic"]
      }
    ]
  },
  // import the function via paths
  functions,
  package: { individually: true },
  custom: {
    autoswagger: {
      typefiles: ['./src/types/product.d.ts']
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    }
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue"
        }
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
          Subscription: [
            {
              Endpoint: 'eknathkumbharv1@hotmail.com',
              Protocol: 'email'
            }
          ]
        }
      },
      createProductTopicSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: 'eknathkumbharv1@gmail.com',
          Protocol: 'email',
          TopicArn: { Ref: "createProductTopic" },
          FilterPolicy: {
            price: [{ numeric: ['>', 10] }]
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
