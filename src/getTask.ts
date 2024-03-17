import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from "aws-sdk";
import { tableName } from './config';
import { Task } from './types/task';


const getTask: APIGatewayProxyHandler = async (event) => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();

        const { id } = event.pathParameters as { id: string };

        const result = await dynamodb
            .get({
                TableName: tableName,
                Key: { id },
            })
            .promise();

        const task = result.Item as Task;
        if (task) {
            return {
                statusCode: 200,
                body: JSON.stringify(task),
                headers: {
                    'Content-Type': 'application/json'
                },
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Not exist Task with id ${id}`
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            };
        }
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

export const handler = getTask