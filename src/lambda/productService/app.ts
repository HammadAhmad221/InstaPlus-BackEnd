import { create, update, del } from '../layers/utils/crudUtils';
import { ProductModel,Product } from '../layers/schemas/productSchema';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CONSTANTS } from '../layers/constants/constants';
import { connectToMongoDB, disconnectFromMongoDB } from '../../mongodb/db';
import { Types } from 'mongoose';

interface RequestBody {
  name: string;
  model: string;
  size: string;
  Manufacturer: string;
  Warranty: {
    type: number;
    duration: {
      type: number;
      value: number;
    };
    description: string;
  };
  productPicture: string;
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
        const productData: Partial<Product> = body;
        const newProduct = await create<Product>(ProductModel, productData);
        response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Product Created', Product: newProduct }),
        };
        break;
      }
      case 'update': {
        const id: string = event.queryStringParameters?.id || '';
        const productData: Partial<Product> = body;
        const updatedProduct = await update<Product>(ProductModel, id, productData);
        if (updatedProduct) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Product Updated', Product: updatedProduct }),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Product not found', app_name: CONSTANTS.APP_NAME }),
          };
        }
        break;
      }
      case 'delete': {
        const { id } = event.queryStringParameters || {};
        const deletedProduct = await del<Product>(ProductModel, id);
        if (deletedProduct) {
          response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Product Deleted', Product: deletedProduct }),
          };
        } else {
          response = {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Product not found', app_name: CONSTANTS.APP_NAME }),
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
