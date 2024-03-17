import middy from '@middy/core';
import httpJSONBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from "aws-sdk";
import { v4 } from "uuid";
import { tableName } from './config';
import { Task } from './types/task';
import { TaskCreateDto } from './types/taskCreate.dto';


const addTask: APIGatewayProxyHandler = async (event) => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();

        const { title, description } = event.body as unknown as TaskCreateDto;
        const createdAt = new Date();
        const id = v4();
        const newTask: Task = {
            id,
            title,
            description,
            createdAt,
            done: false,
        };

        await dynamodb.put({
            TableName: tableName,
            Item: newTask,
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ newTask }),
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

export const handler = middy(addTask as any).use(httpJSONBodyParser())