import { SubscriptionModel } from '../layers/schemas/subscriptionSchema';
import { InstallmentModel } from '../layers/schemas/installmentSchema';
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';


exports.handler = async (event) => {
  try {
    const { subscriptionID, customerID } = event.queryStringParameters;
    await connectToMongoDB();

    // Find the subscription based on the subscriptionID and customerID
    const subscription = await SubscriptionModel.findOne({
      _id: subscriptionID,
      customerID: customerID,
    }).lean().exec();

    if (!subscription) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Subscription not found for the given customer' }),
      };
    }

    // Find the installments based on the subscriptionID and customerID
    const installments = await InstallmentModel.find({
      subscriptionID: subscriptionID,
      customerID: customerID,
    }).lean().exec();

    return {
      statusCode: 200,
      body: JSON.stringify(installments),
    };
  } catch (error) {
    console.error('Error getting customer installments:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }finally{
    disconnectFromMongoDB();
  }
};
