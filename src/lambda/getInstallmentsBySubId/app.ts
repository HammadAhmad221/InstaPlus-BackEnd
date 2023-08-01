import { SubscriptionModel } from '../layers/schemas/subscriptionSchema';
import { Plan, PlanModel } from '../layers/schemas/planSchema';
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';
import { Installment, InstallmentModel } from '../layers/schemas/installmentSchema';
import  { Types } from 'mongoose';
// import { Installment, InstallmentModel } from '../layers/schemas/installmentSchema';

exports.handler = async (event) => {
  try {
    await connectToMongoDB(); // Ensure the database connection is established once
    console.log('SubscriptionModel:', SubscriptionModel);
    console.log('Installment',InstallmentModel);
    console.log('Plan',PlanModel);
    const subscriptionID = event.queryStringParameters.subscriptionID;
    const installments = await getInstallments(subscriptionID);
    if (installments.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No installments found for the given subscription' }),
      };
    }else{   
      return {
      statusCode: 200,
      body: JSON.stringify(installments),
    };
  } 
}
  catch (error) {
    console.error('Error calculating installments:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };

 
  } finally {
    disconnectFromMongoDB(); // Disconnect from the database after processing the request
  }
};

async function getInstallments(subscriptionID: string): Promise<Installment[]> {
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
   // await InstallmentModel.insertMany(installments);

    return installments;
  } catch (error) {
    throw error; // Rethrow the error to be caught by the calling code
  }
}


