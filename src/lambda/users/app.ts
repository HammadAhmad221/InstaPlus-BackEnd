
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ5b3VyX3VzZXJfaWQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODk3NDgzNTIsImV4cCI6MTY4OTc3NzE1Mn0.oDBA9RnEvedTa9u_3f9qiu96jpvOspu8eg-K_uwGG2A

/*import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CONSTANTS } from '../layers/constants/constants';
import { connectToMongoDB, disconnectFromMongoDB } from '../../mongodb/db';
import { sendOTP } from '../layers/otpServices/sendotp';
import { verifyOTPAndGenerateToken } from '../layers/otpServices/verifyotp';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  //let postService: UsersPostService = new UsersPostService(event);
  let response: APIGatewayProxyResult;
  try {
    await connectToMongoDB();

    switch (event.headers.Method || event.headers.method) {
      case 'sendotp': {
        const phoneNumber: string = event.queryStringParameters?.phoneNumber || '';
        await sendOTP(phoneNumber);
        response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'OTP sent successfully', app_name: CONSTANTS.APP_NAME }),
        };
        break;
      }
      case 'verifyotp': {
        const phoneNumber: string = event.queryStringParameters?.phoneNumber || '';
        const otp: string = event.queryStringParameters?.otp || '';

        if (phoneNumber && otp) {
          // Verify OTP and generate token
          const result = await verifyOTPAndGenerateToken(phoneNumber, otp);

          if ('verification' in result && !result.verification) {
            response = {
              statusCode: 401,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: 'Invalid OTP', app_name: CONSTANTS.APP_NAME }),
            };
          } else if ('token' in result && result.token && result.user) {
            response = {
              statusCode: 200,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: 'Success', app_name: CONSTANTS.APP_NAME, token: result.token, user: result.user }),
            };
          } else {
            response = {
              statusCode: 500,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: 'Error occurred during OTP verification', app_name: CONSTANTS.APP_NAME }),
            };
          }
        } else {
          response = {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Invalid parameters', app_name: CONSTANTS.APP_NAME }),
          };
        }
        break;
      }
    }
  } catch (err: unknown) {
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : 'Some error occurred',
      }),
    };
  } finally {
    disconnectFromMongoDB();
  }

  return response;
};*/

import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CONSTANTS } from '../layers/constants/constants';
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';
import { sendOTP } from '../layers/otpServices/sendotp';
import { verifyOTPAndGenerateToken } from '../layers/otpServices/verifyotp';

interface RequestBody {
  phoneNumber: string;
  otp?: string;
  method: string;
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  //let postService: UsersPostService = new UsersPostService(event);
  let response: APIGatewayProxyResult;
  try {
    await connectToMongoDB();

    const body: RequestBody = JSON.parse(event.body || '{}');

    switch (event.headers.Method) {
      case 'sendotp': {
        const phoneNumber: string = body.phoneNumber || '';
        await sendOTP(phoneNumber);
        response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'OTP sent successfully', app_name: CONSTANTS.APP_NAME }),
        };
        break;
      }
      case 'verifyotp': {
        const phoneNumber: string = body.phoneNumber || '';
        const otp: string = body.otp || '';

        if (phoneNumber && otp) {
          // Verify OTP and generate token
          const result = await verifyOTPAndGenerateToken(phoneNumber, otp);

          if ('verification' in result && !result.verification) {
            response = {
              statusCode: 401,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: 'Invalid OTP', app_name: CONSTANTS.APP_NAME }),
            };
          } else if ('token' in result && result.token && result.user) {
            response = {
              statusCode: 200,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: 'Success', app_name: CONSTANTS.APP_NAME, token: result.token, user: result.user }),
            };
          } else {
            response = {
              statusCode: 500,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: 'Error occurred during OTP verification', app_name: CONSTANTS.APP_NAME }),
            };
          }
        } else {
          response = {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Invalid parameters', app_name: CONSTANTS.APP_NAME }),
          };
        }
        break;
      }
      default: {
        response = {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Invalid method', app_name: CONSTANTS.APP_NAME }),
        };
      }
    }
  } catch (err: unknown) {
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : 'Some error occurred',
      }),
    };
  } finally {
    disconnectFromMongoDB();
  }

  return response;
};
