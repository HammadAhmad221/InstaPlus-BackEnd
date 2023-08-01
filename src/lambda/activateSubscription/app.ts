import { SubscriptionModel } from '../layers/schemas/subscriptionSchema';
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';
import { Installment, InstallmentModel } from '../layers/schemas/installmentSchema';
import { Types } from 'mongoose';
import { Plan } from '../layers/schemas/planSchema';

exports.handler = async (event) => {
  try {
    await connectToMongoDB(); // Ensure the database connection is established once

    const subscriptionID = event.queryStringParameters.subscriptionID;

    // Get the subscription by ID
    const subscription = await SubscriptionModel.findById(subscriptionID).lean().exec();
    if (!subscription) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Subscription not found' }),
      };
    }

    // Check if the subscription is already activated
    if (subscription.status === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Subscription is already activated' }),
      };
    }

    // Calculate and add the installments to the database
    await addInstallments(subscriptionID);

    // Update the subscription status to 1 (activated)
    await updateSubscriptionStatus(subscriptionID, 1);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscription activated successfully' }),
    };
  } catch (error) {
    console.error('Error activating subscription:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  } finally {
    disconnectFromMongoDB(); // Disconnect from the database after processing the request
  }
};

async function addInstallments(subscriptionID: string): Promise<void> {
  try {
    // Your existing code for calculating installments and adding them to the database goes here...
    // For example:
    const installments = await calculateInstallments(subscriptionID);
    await InstallmentModel.insertMany(installments);
  } catch (error) {
    console.error('Error adding installments:', error.message);
    throw error;
  }
}

async function updateSubscriptionStatus(subscriptionID: string, status: number): Promise<void> {
  try {
    // Find the subscription by ID and update its status
    await SubscriptionModel.findByIdAndUpdate(subscriptionID, { status: status });
  } catch (error) {
    console.error('Error updating subscription status:', error.message);
    throw error;
  }
}

async function calculateInstallments(subscriptionID: string): Promise<Installment[]> {
    try {


    
        // const subscription = await SubscriptionModel.findById(subscriptionId).populate('planID').lean();
        const subscription = await SubscriptionModel.findById(subscriptionID).populate('planID').exec();
        //console.log('query',subscription);
        if (!subscription) {
          throw new Error('Subscription not found');
        }
        // Check if the planID exists
        if (!subscription.planID) {
          throw new Error('Installment plan not found for the given subscription');
        }
    
        const { totalAmount, advance, paymentMethod, startDate } = subscription;
        const installmentPlan = subscription.planID as unknown as Plan;
    
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
        const installments: Installment[] = [];
    
        for (let i = 1; i <= durationInMonths; i++) {
          const installmentAmount = remainingAmount / (durationInMonths - i + 1); // Calculate installment amount for the current month
          const dueDate = new Date(startDate);
          dueDate.setMonth(dueDate.getMonth() + i);
    
          const installmentData: Partial<Installment> = {
            subscriptionID: Types.ObjectId.createFromHexString(subscriptionID), // Use the string subscriptionId directly
            created: new Date(),
            amount: installmentAmount,
            dueDate: dueDate,
            paymentMethod: paymentMethod,
            status: 1,
          };
    
          const installment: Installment = new InstallmentModel(installmentData);
    
          installments.push(installment); // Push the installment object into the array
    
          remainingAmount -= installmentAmount; // Update the remaining amount for the next installment
        }
    
        // Save all the installments to the database (uncomment the following line if you want to save them)
        await InstallmentModel.insertMany(installments);
    
        return installments;
      } catch (error) {
        throw error; // Rethrow the error to be caught by the calling code
      }
}
