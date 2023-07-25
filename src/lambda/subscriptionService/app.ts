import { create, update, del } from '../layers/utils/crudUtils';
import { SubscriptionModel, Subscription } from '../layers/schemas/subscriptionSchema';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CONSTANTS } from '../layers/constants/constants';
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';
import { Types } from 'mongoose';

interface RequestBody {
  planID: Types.ObjectId; // Installment Plan ID
  totalAmount: number;
  advance: number;
  paymentMethod: number;
  startDate: Date;
  endDate: Date;
  productID: Types.ObjectId; // Product ID
  ownerID: Types.ObjectId; // User ID
  customerID: Types.ObjectId; // User ID
  customerDocuments: Types.ObjectId[]; // Array of Document IDs
  guarantors: Types.ObjectId[]; // Array of Guarantor IDs
  status: number;
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
        const subscriptionData: Partial<Subscription> = body;
        const newSubscription = await create<Subscription>(SubscriptionModel, subscriptionData);
        response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Subscription Created', Subscription: newSubscription }),
        };
        break;
      }
      case 'update': {
        const  id : string  = event.queryStringParameters?.id || '';
        const subscriptionData: Partial<Subscription> = body;
        const updatedSubscription = await update<Subscription>(SubscriptionModel, id, subscriptionData);
        if (updatedSubscription) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Subscription Updated', Subscription: updatedSubscription }),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Subscription not found', app_name: CONSTANTS.APP_NAME }),
          };
        }
        break;
      }
      case 'delete': {
        const { id } = event.queryStringParameters || {};
        const deletedSubscription = await del<Subscription>(SubscriptionModel, id);
        if (deletedSubscription) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Subscription Deleted', Subscription: deletedSubscription }),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Subscription not found', app_name: CONSTANTS.APP_NAME }),
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
