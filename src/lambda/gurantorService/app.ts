import { create, update, del } from '../layers/utils/crudUtils';
import { Guarantor, GuarantorModel } from '../layers/schemas/gurantorSchema';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CONSTANTS } from '../layers/constants/constants';
import { connectToMongoDB, disconnectFromMongoDB } from '../../mongodb/db';
import { Types } from 'mongoose';

interface RequestBody {
  userID: Types.ObjectId;
  relationWithCustomer: string;
  employerName: string;
  employerAddress: string;
  type: number;
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
        const guarantorData: Partial<Guarantor> = body;
        const newGuarantor = await create<Guarantor>(GuarantorModel, guarantorData);
        response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Guarantor Created', Guarantor: newGuarantor }),
        };
        break;
      }
      case 'update': {
        const id: string = event.queryStringParameters?.id || '';
        const guarantorData: Partial<Guarantor> = body;
        const updatedGuarantor = await update<Guarantor>(GuarantorModel, id, guarantorData);
        if (updatedGuarantor) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Guarantor Updated', Guarantor: updatedGuarantor }),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Guarantor not found', app_name: CONSTANTS.APP_NAME }),
          };
        }
        break;
      }
      case 'delete': {
        const { id } = event.queryStringParameters || {};
        const deletedGuarantor = await del<Guarantor>(GuarantorModel, id);
        if (deletedGuarantor) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Guarantor Deleted', Guarantor: deletedGuarantor }),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Guarantor not found', app_name: CONSTANTS.APP_NAME }),
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
