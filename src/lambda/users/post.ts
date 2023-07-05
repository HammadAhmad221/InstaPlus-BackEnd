import { APIGatewayProxyHandler,APIGatewayProxyResult } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    let response: APIGatewayProxyResult;
    try {
        response = {
            statusCode: 200,
            body: {"message":"success"},
        };
    } catch (err: unknown) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }
    
        return response;
      
};