import { SubscriptionModel } from '../layers/schemas/subscriptionSchema'; // Replace with the actual path to your SubscriptionModel
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';


export const handler = async (event) => {
  try {
    await connectToMongoDB();
    const customerId = event.queryStringParameters.customerId;

    // Call the getCustomerSubscriptions function
    const subscriptions = await getCustomerSubscriptions(customerId);

    return {
      statusCode: 200,
      body: JSON.stringify(subscriptions),
    };
  } catch (error) {
    console.error('Error fetching customer subscriptions:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }finally{
    disconnectFromMongoDB();
  }
};

async function getCustomerSubscriptions(customerID) {
  try {
    // Find all active subscriptions associated with the customerID
    const activeSubscriptions = await SubscriptionModel.find({
      customerID,
      status: { $in: [1, 2] }, // Assuming 1 represents an active subscription
    }).exec();

    return activeSubscriptions;
  } catch (error) {
    console.error('Error fetching customer subscriptions:', error.message);
    throw error;
  }
}
