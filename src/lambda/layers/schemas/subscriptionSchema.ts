import mongoose, { Schema, Model,Types, Document } from 'mongoose';

// Define the Subscription interface representing the document
interface Subscription extends Document {
  planID: Types.ObjectId; // Installment Plan ID
  totalAmount: number;
  advance: number;
  paymentMethod: number;
  startDate: Date;
  endDate: Date;
  productID: Types.ObjectId; // Product ID
  ownerID: Types.ObjectId; // User ID
  customerID: Types.ObjectId; // User ID
  customerDocuments: Types.ObjectId[]; // Array of Document IDs
  guarantors: Types.ObjectId[]; // Array of Guarantor IDs
  status: number;
  created: Date;
  updated: Date;
}

// Define the Subscription schema
const subscriptionSchema: Schema<Subscription> = new Schema<Subscription>({
  planID: {
    type: Schema.Types.ObjectId,ref:'Plan'
    //required: true,
  },
  totalAmount: {
    type: Number,
  //  required: true,
  },
  advance: {
    type: Number,
    //required: true,
  },
  paymentMethod: {
    type: Number,
//    required: true,
  },
  startDate: {
    type: Date,
  //  required: true,
  },
  endDate: {
    type: Date,
    //required: true,
  },
  productID: {
    type: Schema.Types.ObjectId,ref:'Product'
//    required: true,
  },
  ownerID: {
    type: Schema.Types.ObjectId,ref:'User'
  //  required: true,
  },
  customerID: {
    type: Schema.Types.ObjectId,ref:'User'
    //required: true,
  },
  customerDocuments: [{
    type: Schema.Types.ObjectId,ref:'Document'
//    required: true,
  }],
  guarantors: [{
    type: Schema.Types.ObjectId,ref:'Guarantors'
  //  required: true,
  }],
  status: {
    type: Number,
    //required: true,
  },
  created: {
    type: Date,
    //required: true,
    default: Date.now,
  },
  updated: {
    type: Date,
//    required: true,
    default: Date.now,
  },
});

// Create and export the Subscription model
const SubscriptionModel: Model<Subscription> = mongoose.model<Subscription>('Subscription', subscriptionSchema);

export { Subscription, SubscriptionModel };
