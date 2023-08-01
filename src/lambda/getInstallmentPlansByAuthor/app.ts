import { PlanModel } from '../layers/schemas/planSchema'; 
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';


export const handler = async (event) => {
  try {
    await connectToMongoDB();
    const author = event.queryStringParameters.author;

    // Call the getInstallmentPlans function
    const installmentPlans = await getInstallmentPlans(author);

    return {
      statusCode: 200,
      body: JSON.stringify(installmentPlans),
    };
  } catch (error) {
    console.error('Error fetching installment plans:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }finally{
    disconnectFromMongoDB();
  }
};

async function getInstallmentPlans(author) {
  try {
    // Find all installment plans associated with the author
    const installmentPlans = await PlanModel.find({ author }).exec();

    return installmentPlans;
  } catch (error) {
    console.error('Error fetching installment plans:', error.message);
    throw error;
  }
}
