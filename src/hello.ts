import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    try {
        console.log('Event:', event);
        console.log('Context:', context);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Hello from Lambda!'
            })
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
