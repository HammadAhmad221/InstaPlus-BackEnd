import { APIGatewayProxyHandler,APIGatewayProxyResult } from 'aws-lambda';
import { CONSTANTS } from '../layers/constants/constants';
import { UsersPostService } from './services/post/post.service';
import { connectToMongoDB, disconnectFromMongoDB } from '../../mongodb/db';
// import { UserModel } from '../layers/users/user';
// import AWS from 'aws-sdk';
import { sendOTP } from '../layers/users/smsotp';






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
        await sendOTP("+923004423316");

/*const user = { phoneNumber: '03069120220' }; // Provide the user data
try {
  const savedUser = await saveUser(user);
  console.log('User saved:', savedUser);
} catch (error) {
  console.error('Failed to save user:', error);
}*/

// Call the sendOTP function
/*sendOTP('+923138111996')
  .then(() => {
    console.log('OTP sent successfully');
  })
  .catch((error) => {
    console.error('Failed to send OTP:', error);
  });*/


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
      
};
//Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ5b3VyX3VzZXJfaWQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODkzMTQzNDksImV4cCI6MTY4OTM0MzE0OX0.IO34mREiCIoJMFBxmgsYr7kNlXGay6tll6Utc3Cxa_0


/*const sendOTP = async (phoneNumber: string): Promise<void> => {
  try {
    const user = await UserModel.findOne({ phoneNumber });

    if (user) {
      // User exists, send OTP to the phone number
      const otp = generateOTP(); // Implement OTP generation logic
      await sendOTPToPhoneNumber(phoneNumber, otp); // Implement sending OTP via SMS
    } else {
      // User doesn't exist, save the phone number and send OTP
      const newUser = new UserModel({ phoneNumber });
      await newUser.save();
      const otp = generateOTP(); // Implement OTP generation logic
      await sendOTPToPhoneNumber(phoneNumber, otp); // Implement sending OTP via SMS
    }
  } catch (error) {
    throw error;
  }
};

const generateOTP = (): string => {
  // Implement OTP generation logic (e.g., generating a random 6-digit code)
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPToPhoneNumber = async (phoneNumber: string, otp: string): Promise<void> => {
  // Implement sending OTP to the phone number via SMS using AWS SNS or other service
  const sns = new AWS.SNS();
  const params = {
    Message: `Your OTP: ${otp}`,
    PhoneNumber: phoneNumber,
  };
  await sns.publish(params).promise();
};*/

