import mongoose, { ConnectOptions } from 'mongoose';
import path from 'path';

const getOptions = (): ConnectOptions => {
  const options: ConnectOptions = {
    dbName: 'Insta-Plus',
    tlsCAFile: path.resolve('/opt/security/rds-combined-ca-bundle.pem')
  };

  return options;
};

export const connectToMongoDB = async (): Promise<typeof mongoose> => {
  const options = getOptions();

  try {
    const connection = await mongoose.connect(
      'mongodb://host.docker.internal:27017/users',
      options,
    );
    console.log('DB Connected');
    return connection;
  } catch (error) {
    console.error('MongoDB Connection Problem:', error);
    throw error;
  }
};

export const disconnectFromMongoDB = (): void => {
  mongoose.disconnect();
  console.log('Disconnected from MongoDB');
};
