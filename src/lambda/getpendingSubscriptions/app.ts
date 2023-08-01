import { SubscriptionModel } from '../layers/schemas/subscriptionSchema'; // Replace with the actual path to your SubscriptionModel
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';


export const handler = async () => {
  try {
    await connectToMongoDB();
    // Get all active subscriptions
    const activeSubscriptions = await SubscriptionModel.find({ status: 1 }).exec();

    // Calculate the total active subscriptions
    const totalActiveSubscriptions = activeSubscriptions.length;

    // Calculate the total received amount and total pending amount
    let totalReceivedAmount = 0;
    let totalPendingAmount = 0;

    activeSubscriptions.forEach((subscription) => {
      totalReceivedAmount += subscription.advance;
      totalPendingAmount += subscription.totalAmount - subscription.advance;
    });

    // Calculate the total due for this month and total overdue amount
    let totalDueThisMonth = 0;
    let totalOverdueAmount = 0;

    const currentDate = new Date();
    activeSubscriptions.forEach((subscription) => {
      if (subscription.endDate >= currentDate) {
        totalDueThisMonth += subscription.totalAmount - subscription.advance;
      } else {
        totalOverdueAmount += subscription.totalAmount - subscription.advance;
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalActiveSubscriptions,
        totalReceivedAmount,
        totalPendingAmount,
        totalDueThisMonth,
        totalOverdueAmount,
      }),
    };
  } catch (error) {
    console.error('Error fetching pending subscriptions:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }finally{
    disconnectFromMongoDB();
  }
};
