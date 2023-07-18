/*import { APIGatewayProxyHandler,APIGatewayProxyResult } from 'aws-lambda';
import { CONSTANTS } from '../layers/constants/constants';
import { UsersPostService } from './services/post/post.service';
import { connectToMongoDB, disconnectFromMongoDB } from '../../mongodb/db';
// import { UserModel } from '../layers/users/user';
// import AWS from 'aws-sdk';
import { sendOTP } from '../layers/services/sendotp';
import {verifyOTPAndGenerateToken} from '../layers/services/verifyotp';

export const handler: APIGatewayProxyHandler = async (event, context) => {
   let postService:UsersPostService=new UsersPostService(event);
    let response: APIGatewayProxyResult;
    try {
        await connectToMongoDB();
        response = {
            statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
            body: JSON.stringify({"message":"success","app_name":CONSTANTS.APP_NAME,"service":postService.generateOTP()}),
        };
       // await sendOTP("+923004423316");
        await verifyOTPAndGenerateToken("+923004423316","291101");
        console.log(event.headers.Method);
    } catch (err: unknown) {
       // console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
     }
     finally{
        disconnectFromMongoDB();
     }
    
        return response;
      
};*/
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ5b3VyX3VzZXJfaWQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODk2NjYwNzAsImV4cCI6MTY4OTY5NDg3MH0.lcu1Ja9wcMf_Xwn3X3ahePhyYrawLq75OAgTc0z44LM

import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CONSTANTS } from '../layers/constants/constants';
//import { UsersPostService } from './services/post/post.service';
import { connectToMongoDB, disconnectFromMongoDB } from '../../mongodb/db';
import { sendOTP } from '../layers/services/sendotp';
import { verifyOTPAndGenerateToken } from '../layers/services/verifyotp';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  //let postService: UsersPostService = new UsersPostService(event);
  let response: APIGatewayProxyResult;
  try {
    await connectToMongoDB();

    switch (event.headers.Method) {
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
          } else if ('token' in result && result.token && result.record) {
            response = {
              statusCode: 200,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: 'Success', app_name: CONSTANTS.APP_NAME, token: result.token, record: result.record }),
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
};
