import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const bucketName = 'hotmeal'; // Replace with your S3 bucket name

    // Ensure the event contains the file to be uploaded
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No file found in the request' }),
      };
    }

    // Parse the event body to extract the file content and other information
    const { fileName, fileType, fileContent } = JSON.parse(event.body);

    // Convert the base64-encoded file content to a buffer
    const fileBuffer = Buffer.from(fileContent, 'base64');

    // Upload the file to S3
    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: fileType,
      ACL: 'private', // Make the uploaded file publicly readable
    };

    await s3.putObject(params).promise();

    // Return the URL of the uploaded file
    const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ imageUrl: fileUrl }),
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
