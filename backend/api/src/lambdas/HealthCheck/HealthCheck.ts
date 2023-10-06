import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { headers } from 'src/utils/DefaultHeaders';

export const lambda = (event: APIGatewayProxyEvent): APIGatewayProxyResult => {
    console.log('event 👉', event);

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({message: 'Successful lambda invocation'}),
    }
}
