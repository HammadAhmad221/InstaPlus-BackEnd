import mongoose, { Schema, Model, Types, Document } from 'mongoose';


// Define the Installment interface representing the document
interface Installment extends Document {
  subscriptionID: Types.ObjectId;
  ownerID: Types.ObjectId;
  customerID: Types.ObjectId;
  created: Date;
  amount: number;
  dueDate: Date;
  paymentMethod: number;
  status: number;
  paidOn?: Date;
  paidBy?: Types.ObjectId; // User ID
  paidTo?: Types.ObjectId; // User ID
  
}

// Define the Installment schema
const installmentSchema: Schema<Installment> = new Schema<Installment>({
  subscriptionID: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
   // required: true,
  },
  ownerID: {
    type: Schema.Types.ObjectId,
    //required: true,
  },
  customerID: {
    type: Schema.Types.ObjectId,
    //required: true,
  },
  created: {
    type: Date,
    //required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    //required: true,
  },
  dueDate: {
    type: Date,
    //required: true,
  },
  paymentMethod: {
    type: Number,
    //required: true,
  },
  status: {
    type: Number,
    //required: true,
  },
  paidOn: {
    type: Date,
  },
  paidBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  paidTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

// Create and export the Installment model
const InstallmentModel: Model<Installment> = mongoose.model<Installment>('Installment', installmentSchema);

export { Installment, InstallmentModel };
