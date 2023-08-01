import { create, update, del } from '../layers/utils/crudUtils';
import { PlanModel, Plan } from '../layers/schemas/planSchema';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CONSTANTS } from '../layers/constants/constants';
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';
import { Types } from 'mongoose';

interface RequestBody {
  planName: string;
  duration: {
    type: 'year' | 'month';
    value: number;
  };
  fee: {
    type: 'percentage' | 'flat';
    value: number;
  };
  advance: {
    type: 'percentage' | 'flat';
    value: number;
  };
  author: Types.ObjectId;
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
        const installmentPlanData: Partial<Plan> = body;
        const newInstallmentPlan = await create<Plan>(PlanModel, installmentPlanData);
        response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Installment Plan Created', InstallmentPlan: newInstallmentPlan }),
        };
        break;
      }
      case 'update': {
        const id: string = event.queryStringParameters?.id || '';
        const installmentPlanData: Partial<Plan> = body;
        const updatedInstallmentPlan = await update<Plan>(PlanModel, id, installmentPlanData);
        if (updatedInstallmentPlan) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Installment Plan Updated', InstallmentPlan: updatedInstallmentPlan }),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Installment Plan not found', app_name: CONSTANTS.APP_NAME }),
          };
        }
        break;
      }
      case 'delete': {
        const { id } = event.queryStringParameters || {};
        const deletedInstallmentPlan = await del<Plan>(PlanModel, id);
        if (deletedInstallmentPlan) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Installment Plan Deleted', InstallmentPlan: deletedInstallmentPlan }),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Installment Plan not found', app_name: CONSTANTS.APP_NAME }),
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
