import { APIGatewayTokenAuthorizerEvent, APIGatewayRequestAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const handler = async (event: APIGatewayTokenAuthorizerEvent | APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  console.log('Authorizer is working');

  // Extract the authorization token from the event
  const authorizationToken = getAuthorizationToken(event);
  if (!authorizationToken) {
    throw new Error('Unauthorized: Authorization token not found');
  }

  // Extract the token from the authorization header
  const token = extractToken(authorizationToken);
  if (!token) {
    throw new Error('Unauthorized: Token not found');
  }

  // Validate the authorization token
  const isAuthorized = await validateAuthorizationToken(token);
  if (!isAuthorized) {
    throw new Error('Unauthorized: Invalid token');
  }

  // Return the principal ID and allow access
  return generatePolicy('user', 'Allow', event.methodArn);
};

const getAuthorizationToken = (event: APIGatewayTokenAuthorizerEvent | APIGatewayRequestAuthorizerEvent): string | null => {
  if ('authorizationToken' in event) {
    return event.authorizationToken;
  }
  return null;
};

const extractToken = (authorizationToken: string): string | null => {
  const match = authorizationToken.match(/^Bearer (.+)$/);
  return match?.[1] ?? null;
};

const validateAuthorizationToken = async (token: string): Promise<boolean> => {
  try {
    const decodedToken = jwt.verify(token, 'sir_amaar') as JwtPayload;
    //console.log('Decoded token:', decodedToken);
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

const generatePolicy = (principalId: string, effect: string, resource: string): APIGatewayAuthorizerResult => {
  const authResponse: APIGatewayAuthorizerResult = {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };

  return authResponse;
};
