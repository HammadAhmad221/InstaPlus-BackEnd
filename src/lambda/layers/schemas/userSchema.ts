
import mongoose, { Schema,Document } from 'mongoose';

// Define the User interface representing the document
interface User extends Document{
  type: 'merchant' | 'customer';
  phoneNumber: string;
  profilePicture?: string;
  Name: string;
  CNIC: string;
  occupation?: string;
  address?: string;
  businessName?: string;
  businessAddress?: string;
  monthlyIncome?: number;
  created: Date;
  updated: Date;
}

// Define the User schema
const userSchema: Schema<User> = new Schema<User>({
  type: {
    type: String,
    enum: ['merchant', 'customer'],
    //required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  Name: {
    type: String,
   // required: true,
  },
  CNIC: {
    type: String,
    //required: true,
  },
  occupation: {
    type: String,
  },
  address: {
    type: String,
  },
  businessName: {
    type: String,
  },
  businessAddress: {
    type: String,
  },
  monthlyIncome: {
    type: Number,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Create and export the User model
const UserModel = mongoose.model<User>('User', userSchema);

export { UserModel,User };

