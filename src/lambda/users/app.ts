import { APIGatewayProxyHandler,APIGatewayProxyResult } from 'aws-lambda';
import { CONSTANTS } from '../layers/constants/constants';
import { UsersPostService } from './services/post/post.service';
import { connectToMongoDB, disconnectFromMongoDB } from '../../mongodb/db';




export const handler: APIGatewayProxyHandler = async (event, context) => {
   let postService:UsersPostService=new UsersPostService(event);
    let response: APIGatewayProxyResult;
    try {
        //connect to db
       // console.log('testing db');
        await connectToMongoDB();
        response = {
            statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
            body: JSON.stringify({"message":"success","app_name":CONSTANTS.APP_NAME,"service":postService.generateOTP()}),
        };
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
      
};