import { SubscriptionModel } from '../layers/schemas/subscriptionSchema';
import { InstallmentPlan,InstallmentPlanModel } from '../layers/schemas/installmentPlanSchema';
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';

exports.handler = async (event) => {
  try {
    await connectToMongoDB(); // Ensure the database connection is established once

    const subscriptionId: string = event.queryStringParameters.subscriptionId;

    const installments = await getInstallments(subscriptionId);

    if (installments.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No installments found for the given subscription' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(installments),
    };
  } catch (error) {
    console.error('Error calculating installments:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  } finally {
    disconnectFromMongoDB(); // Disconnect from the database after processing the request
  }
};

async function getInstallments(subscriptionId: string): Promise<InstallmentPlan[]> {
  try {
    const subscription = await SubscriptionModel.findById(subscriptionId).populate('planID').lean();

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Check if the planID exists
    if (!subscription.planID) {
      throw new Error('Installment plan not found for the given subscription');
    }

    const { totalAmount, advance, paymentMethod, startDate } = subscription;
    const installmentPlan = subscription.planID as unknown as InstallmentPlan;

    const { duration, fee } = installmentPlan;

    // Calculate the remaining amount after advance payment and fee
    let remainingAmount = totalAmount - advance;
    if (fee.type === 'flat') {
      remainingAmount -= fee.value;
    } else if (fee.type === 'percentage') {
      remainingAmount -= (fee.value / 100) * totalAmount;
    }

    // Calculate the number of installments based on the duration (number of months or years)
    let durationInMonths = 0;
    if (duration.type === 'month') {
      durationInMonths = duration.value;
    } else if (duration.type === 'year') {
      durationInMonths = duration.value * 12;
    }

    // Calculate the installment amount and the due dates for each installment
    const installments: InstallmentPlan[] = [];

    for (let i = 1; i <= durationInMonths; i++) {
      const installmentAmount = remainingAmount / (durationInMonths - i + 1); // Calculate installment amount for the current month
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      const installment: InstallmentPlan = new InstallmentPlanModel({
        subscriptionID:subscriptionId,
        created: new Date(),
        amount: installmentAmount,
        dueDate: dueDate,
        paymentMethod: paymentMethod,
        status: 0
      });
      

      installments.push(installment); // Push the installment object into the array

      remainingAmount -= installmentAmount; // Update the remaining amount for the next installment
    }

    return installments;
  } catch (error) {
    console.error('Error calculating installments:', error.message);
    throw error;
  }
}
