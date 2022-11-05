import { NoProductFound } from "./errors";
import { Product } from "./types/product";
import AWS from 'aws-sdk';
import { randomUUID } from "crypto";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";


export class ProductService {
    DB_REGION: string;
    PRODUCT_TABLE_NAME: string;
    STOCK_TABLE_NAME: string
    dynamoDbDocumentClient: any;

    constructor() {
        ({ DB_REGION: this.DB_REGION, PRODUCT_TABLE_NAME: this.PRODUCT_TABLE_NAME, STOCK_TABLE_NAME: this.STOCK_TABLE_NAME } = process.env);
        AWS.config.update({ region: this.DB_REGION });
        this.dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();
    }

    async getProducts(): Promise<Array<Product>> {
        return new Promise(async (resolve, reject) => {
            try {
                const productsTableData: any = await this.getTableDataBy(this.PRODUCT_TABLE_NAME);
                const stocksTableData: any = await this.getTableDataBy(this.STOCK_TABLE_NAME);
                resolve(this.innerJoin(productsTableData.Items, stocksTableData.Items));
            } catch (error) {
                reject(error);
            }
        })
    }

    async getTableDataBy(tableName: string): Promise<any> {
        return this.dynamoDbDocumentClient.scan({
            TableName: tableName
        }).promise();
    }

    async getProductBy(productId: string): Promise<Product> {
        return new Promise(async (resolve, reject) => {
            try {
                const product = await this.getSingleItemBy(this.PRODUCT_TABLE_NAME, { 'id': productId });
                this.checkIfProductExists(product);
                const stock = await this.getSingleItemBy(this.STOCK_TABLE_NAME, { 'product_id': productId });
                resolve({ ...product.Item, count: stock.Item.count })
            } catch (error) {
                reject(error)
            }
        })
    }

    async getSingleItemBy(tableName, key: any): Promise<any> {
        return this.dynamoDbDocumentClient.get({
            TableName: tableName,
            Key: key
        }).promise();
    }

    checkIfProductExists(product: any) {
        if (!product.hasOwnProperty('Item')) {
            throw new NoProductFound()
        }
    }

    innerJoin(productsData: Array<any>, stocksData: Array<any>): Array<Product> {
        return productsData.map(product => {
            return { ...product, count: stocksData.find(stock => stock.product_id === product.id).count }
        });
    }

    async insertProduct(product: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const productId = randomUUID();
                const { count, ...productData } = product;

                await this.dynamoDbDocumentClient.transactWrite({
                    TransactItems: [{
                        Put: {
                            TableName: this.PRODUCT_TABLE_NAME,
                            Item: {
                                id: productId,
                                ...productData
                            },
                        }
                    }, {
                        Put: {
                            TableName: this.STOCK_TABLE_NAME,
                            Item: {
                                product_id: productId,
                                count
                            },
                        }
                    }]
                }).promise();

                resolve({ ...product, id: productId })
            } catch (error) {
                reject(error)
            }
        });
    }

    getSnsClient(): SNSClient {
        return new SNSClient({ region: process.env.REGION });
    }

    async publishToTopic(message: any) {
        var params = {
            Message: message,
            TopicArn: process.env.TOPIC_ARN,
        };

        return new Promise(async (resolve, reject) => {
            try {
                const snsClient = this.getSnsClient();
                const data = await snsClient.send(new PublishCommand(params));
                resolve(data)
            } catch (error) {
                reject(error);
            }
        })
    }
}