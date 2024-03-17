import middy from '@middy/core';
import httpJSONBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from "aws-sdk";
import { tableName } from './config';
import { TaskUpdateDto } from './types/taskUpdate.dto';


const updateTask: APIGatewayProxyHandler = async (event) => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const { id } = event.pathParameters as { id: string };

        const { done } = event.body as unknown as TaskUpdateDto

        await dynamodb
            .update({
                TableName: tableName,
                Key: { id },
                UpdateExpression: "set done = :done",
                ExpressionAttributeValues: {
                    ":done": done,
                },
                ReturnValues: "ALL_NEW",
            })
            .promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "task updated",
            }),
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

export const handler = middy(updateTask as any).use(httpJSONBodyParser())