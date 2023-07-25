import { create, update, del } from '../layers/utils/crudUtils';
import { DocumentModel,DocumentEntity } from '../layers/schemas/documentEntitySchema';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CONSTANTS } from '../layers/constants/constants';
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';
import { Types } from 'mongoose';

interface Validity {
  from: Date;
  to: Date;
}

interface RequestBody {
  name: string;
  type: number;
  frontPhoto: string;
  backPhoto: string;
  description: string;
  validity: Validity;
  userID: Types.ObjectId;
  ownerID: Types.ObjectId;
  created?: Date;
  updated?: Date;
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  let response: APIGatewayProxyResult;
  try {
    await connectToMongoDB();

    const body: RequestBody = JSON.parse(event.body || '{}');

    switch (event.headers.Method || event.headers.method) {
      case 'create': {
        const documentData: Partial<DocumentEntity> = body;
        const newDocument = await create<DocumentEntity>(DocumentModel, documentData);
        response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Document Created',Document: newDocument}),
        };
        break;
      }
      case 'update': {
        const id: string = event.queryStringParameters?.id || '';
        const documentData: Partial<DocumentEntity> = body;
        const updatedDocument = await update<DocumentEntity>(DocumentModel, id, documentData);
        if (updatedDocument) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({message:'Document Updated',Document:updatedDocument}),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Document not found', app_name: CONSTANTS.APP_NAME }),
          };
        }
        break;
      }
      case 'delete': {
        const {id}  = event.queryStringParameters || {};
        const deletedDocument = await del<DocumentEntity>(DocumentModel, id);
        if (deletedDocument) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({message:'Document Deleted',Document:deletedDocument}),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Document not found', app_name: CONSTANTS.APP_NAME }),
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
