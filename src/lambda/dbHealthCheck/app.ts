//import { MongoClient } from 'mongodb';
import { connectToMongoDB, disconnectFromMongoDB } from '../layers/mongodb/db';


// ...

//const dbClient = new MongoClient('mongodb://coderefs:Ammar12345678@coderefs-cluster.cluster-cdnvpfxnc7qm.us-west-2.docdb.amazonaws.com:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true');

export const handler = async (event: any): Promise<any> => {
  try {
    // Connect to the database
    //await dbClient.connect();
    await connectToMongoDB();
    //console.log('Database connection successful');

    // Perform other API logic here

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'API response DB is connected' }),
    };
  } catch (error) {
    //console.error('Database connection error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  } finally {
    // Always close the database connection
    disconnectFromMongoDB();
  }
};
