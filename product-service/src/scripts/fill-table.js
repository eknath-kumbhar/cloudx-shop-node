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

const getItem = async (tableName, id) => {
  return await dynamo.get({
    TableName: tableName,
    Key: { id }
  }).promise();
};

// fill Product and Stock tables based on mocked json data
const insertProductwithStocks = () => {
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
}

// Get Product from DB 
const getProduct = async () => {
  const product = await getItem(PRODUCT_TABLE_NAME, "7567ec4b-b10c-48c5-9345-fc73c48a8066")
  console.log(product, 'product');
}