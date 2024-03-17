import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from "aws-sdk";
import { tableName } from './config';


const deleteTask: APIGatewayProxyHandler = async (event) => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const { id } = event.pathParameters as { id: string };

        await dynamodb
            .delete({
                TableName: tableName,
                Key: {
                    id,
                },
            })
            .promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Deleted Task'
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

export const handler = deleteTask