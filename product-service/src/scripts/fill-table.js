/*
    To run the script navigate to cd product-service/src/scripts
    and run node fill-tables.js
*/

const productsList = require('../assets/products.json');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });
const dynamo = new AWS.DynamoDB.DocumentClient();

const PRODUCT_TABLE_NAME = 'products';
const STOCK_TABLE_NAME = 'stocks';

const putItems = async (tableName, item) => {
  return await dynamo.put({
    TableName: tableName,
    Item: item
  }).promise();
};

// fill Product and Stock tables based on mocked json data
productsList.map(async (product) => {
  const {
    count,
    description,
    id,
    price,
    title,
  } = product;

  await putItems(PRODUCT_TABLE_NAME, {
    id,
    description,
    price,
    title,
  });
  await putItems(STOCK_TABLE_NAME, {
    product_id: id,
    count,
  });
});
