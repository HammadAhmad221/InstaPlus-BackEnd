import { UserModel } from '../layers/schemas/userSchema'; // Replace with the actual path to your UserModel
import { SubscriptionModel } from '../layers/schemas/subscriptionSchema'; // Replace with the actual path to your SubscriptionModel
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';


export const handler = async (event) => {
  try {
await connectToMongoDB();
    const ownerId = event.queryStringParameters.ownerId;

    // Call the getCustomersByOwnerID function
    const customers = await getCustomersByOwnerID(ownerId);

    return {
      statusCode: 200,
      body: JSON.stringify(customers),
    };
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }finally{
    disconnectFromMongoDB();
  }
};

async function getCustomersByOwnerID(ownerID) {
  try {
    // Find the owner in the UserModel
    const owner = await UserModel.findById(ownerID).exec();

    if (!owner) {
      throw new Error('Owner not found');
    }

    // Find all active subscriptions associated with the owner
    const activeSubscriptions = await SubscriptionModel.find({
      ownerID: ownerID,
      status: { $in: [1, 2] }, // Assuming 1 represents an active subscription and 2 represents a partially paid subscription
    })
    .populate('customerID') // Populate the customerID field to get the customer details
    .exec();

    // Extract and return customer profiles from the active subscriptions
    const customers = activeSubscriptions.map((subscription) => {
      return subscription.customerID;
    });

    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    throw error;
  }
}
