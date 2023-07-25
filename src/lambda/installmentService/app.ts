import { Installment, InstallmentModel } from '../layers/schemas/installmentSchema';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';
import { Types } from 'mongoose';
import { create, update, del } from '../layers/utils/crudUtils';
import { CONSTANTS } from '../layers/constants/constants';

interface RequestBody {
  subscriptionID: Types.ObjectId;
  ownerID: Types.ObjectId;
  customerID: Types.ObjectId;
  created: Date;
  amount: number;
  dueDate: Date;
  paymentMethod: number;
  status: number;
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  let response: APIGatewayProxyResult;
  try {
    await connectToMongoDB();

    const body: RequestBody = JSON.parse(event.body || '{}');

    switch (event.headers.Method || event.headers.method) {
      case 'create': {
        const documentData: Partial<Installment> = body;
        const newDocument = await create<Installment>(InstallmentModel, documentData);
        response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Installment Created',Document: newDocument}),
        };
        break;
      }
      case 'update': {
        const id: string = event.queryStringParameters?.id || '';
        const documentData: Partial<Installment> = body;
        const updatedDocument = await update<Installment>(InstallmentModel, id, documentData);
        if (updatedDocument) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({message:'Installment Updated',Document:updatedDocument}),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Installment not found', app_name: CONSTANTS.APP_NAME }),
          };
        }
        break;
      }
      case 'delete': {
        const {id}  = event.queryStringParameters || {};
        const deletedDocument = await del<Installment>(InstallmentModel, id);
        if (deletedDocument) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({message:'Installment Deleted',Document:deletedDocument}),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Installment not found', app_name: CONSTANTS.APP_NAME }),
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
