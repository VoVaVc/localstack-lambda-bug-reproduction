import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

const generatePolicy = (principalId: string, methodArn: string) => {
    // By default, API Gateway authorizations are cached (TTL) for 300 seconds.
    // This policy will authorize all requests to the same API Gateway instance where the
    // request is coming from, thus being efficient and optimising costs.

    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: methodArn,
            }],
        },
    }
}

export const lambda = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    if (!event.methodArn) {
        throw new Error('payload.sub or methodArn does not exist');
    }

    const policy = generatePolicy('1', event.methodArn);
    return policy
}
