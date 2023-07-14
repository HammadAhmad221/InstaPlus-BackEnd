import mongoose, { Schema } from 'mongoose';

interface User {
  phoneNumber: string;
}

const userSchema = new Schema<User>({
  phoneNumber: { type: String, required: true, unique: true },
});

const UserModel = mongoose.model<User>('User', userSchema);

// Function to save user data
/*const saveUser = async (userData: User): Promise<User> => {
  try {
    const user = new UserModel(userData);
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    throw error;
  }
};*/

export { UserModel/*, saveUser */};

// {
//     region: 'us-east-1', // Replace with the desired AWS region
//     credentials: {
//         accessKeyId: 'AKIAZLXGMU5DXT4PKSXW', // Replace with your AWS access key ID
//         secretAccessKey: 'fxqwAFKgF8nH4AXy8PKo3FQmVl4o3qWUXmNKeV+N', // Replace with your AWS secret access key
//     },
//     // Add any other desired configuration options here
//   }