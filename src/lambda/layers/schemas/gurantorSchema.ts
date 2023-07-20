import mongoose, { Schema, Model, Types, Document } from 'mongoose';

interface Guarantor extends Document {
  userID: Types.ObjectId; // User ID (ObjectID)
  relationWithCustomer: string;
  employerName: string;
  employerAddress: string;
  type: number;
  created: Date;
  updated: Date;
}

// Define the `Guarantor` schema

const guarantorSchema: Schema<Guarantor> = new Schema<Guarantor>({
  userID: {
    type: Schema.Types.ObjectId,ref:'User'
   // required: true,
  },
  relationWithCustomer: {
    type: String,
   // required: true,
  },
  employerName: {
    type: String,
    //required: true,
  },
  employerAddress: {
    type: String,
   // required: true,
  },
  type: {
    type: Number,
   // required: true,
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

// Create and export the `GuarantorModel` model

const GuarantorModel: Model<Guarantor> = mongoose.model<Guarantor>('Guarantor', guarantorSchema);

export { Guarantor, GuarantorModel };
