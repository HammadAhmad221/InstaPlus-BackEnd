// subscriptionService.ts
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';
import { SubscriptionModel, Subscription } from '../layers/schemas/subscriptionSchema';
import { UserModel, User } from '../layers/schemas/userSchema';

exports.handler = async (event) => {
    try {
        await connectToMongoDB();
      // Parse the ownerId from the event or wherever you're getting it from
      const ownerId:string = event.queryStringParameters.ownerId;
  
      const subscriptionsWithCustomerData = await getAllSubscriptionsWithCustomerData(ownerId);
  
      return {
        statusCode: 200,
        body: JSON.stringify(subscriptionsWithCustomerData),
      };
    } catch (error) {
      console.error('Error:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
      };
    }finally{
     disconnectFromMongoDB();
    }
  };


async function getAllSubscriptionsWithCustomerData(ownerId: string): Promise<Subscription[]> {
  try {
    // Find all subscriptions with the given ownerID and populate the customer data
    const subscriptions = await SubscriptionModel.find({ ownerID: ownerId }).populate('ownerID').lean();

    // If no subscriptions are found, return an empty array
    if (!subscriptions || subscriptions.length === 0) {
      return [];
    }

    // Map the customer data to the respective subscriptions
    const subscriptionsWithCustomerData: Subscription[] = subscriptions.map((subscription) => {
      const customerID = subscription.customerID as unknown;
      const customer: User | null = customerID instanceof UserModel ? customerID : null;

      return {
        ...subscription,
        customer,
      };
    });

    return subscriptionsWithCustomerData;
  } catch (error) {
    console.error('Error fetching subscriptions with customer data:', error.message);
    throw error;
  }
}

