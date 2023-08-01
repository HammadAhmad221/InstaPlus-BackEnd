import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const bucketName = 'hotmeal'; // Replace with your S3 bucket name

    // Extract the image file name from the request query parameters
    const fileName = event.queryStringParameters?.fileName;

    if (!fileName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing "fileName" query parameter' }),
      };
    }

    // Generate a pre-signed URL to allow downloading the image from S3
    const params: AWS.S3.PresignedPost.Params = {
      Bucket: bucketName,
      Fields: {
        Key: fileName,
      },
      Expires: 60, // URL expiration time in seconds (adjust as needed)
    };

    const presignedUrl = await s3.createPresignedPost(params);

    return {
      statusCode: 200,
      body: JSON.stringify({ presignedUrl }),
    };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
