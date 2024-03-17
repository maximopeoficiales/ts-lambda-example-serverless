import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from "aws-sdk";
import { tableName } from './config';
import { Task } from './types/task';


const getTasks: APIGatewayProxyHandler = async (event) => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();

        const result = await dynamodb.scan({ TableName: tableName }).promise();

        const tasks = result.Items as Task[];

        return {
            statusCode: 200,
            body: JSON.stringify(tasks),
            headers: {
                'Content-Type': 'application/json'
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
                error
            })
        };
    }
};

export const handler = getTasks