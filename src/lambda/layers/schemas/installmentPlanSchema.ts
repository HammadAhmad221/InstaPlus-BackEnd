import mongoose, { Schema, Model,Types, Document } from 'mongoose';

// Define the inner schema for Duration
interface Duration {
  type: 'year' | 'month';
  value: number;
}

// Define the inner schema for Fee
interface Fee {
  type: 'percentage' | 'flat';
  value: number;
}

// Define the inner schema for Advance
interface Advance {
  type: 'percentage' | 'flat';
  value: number;
}

// Define the Installment Plan interface representing the document
interface InstallmentPlan extends Document {
  planName: string;
  duration: Duration;
  fee: Fee;
  advance: Advance;
  author: Types.ObjectId;
  created: Date;
  updated: Date;
}

// Define the Duration schema
const durationSchema: Schema<Duration> = new Schema<Duration>({
  type: {
    type: String,
    enum: ['year', 'month'],
    //required: true,
  },
  value: {
    type: Number,
   // required: true,
  },
}, { _id: false });

// Define the Fee schema
const feeSchema: Schema<Fee> = new Schema<Fee>({
  type: {
    type: String,
    enum: ['percentage', 'flat'],
    //required: true,
  },
  value: {
    type: Number,
    //required: true,
  },
}, { _id: false });

// Define the Advance schema
const advanceSchema: Schema<Advance> = new Schema<Advance>({
  type: {
    type: String,
    enum: ['percentage', 'flat'],
    //required: true,
  },
  value: {
    type: Number,
    //required: true,
  },
}, { _id: false });

// Define the Installment Plan schema
const installmentPlanSchema: Schema<InstallmentPlan> = new Schema<InstallmentPlan>({
  planName: {
    type: String,
    //required: true,
  },
  duration: {
    type: durationSchema,
    //required: true,
  },
  fee: {
    type: feeSchema,
    //required: true,
  },
  advance: {
    type: advanceSchema,
    //required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    //required: true,
  },
  created: {
    type: Date,
    //required: true,
    default: Date.now,
  },
  updated: {
    type: Date,
    //required: true,
    default: Date.now,
  },
});

// Create and export the Installment Plan model
const InstallmentPlanModel: Model<InstallmentPlan> = mongoose.model<InstallmentPlan>('InstallmentPlan', installmentPlanSchema);

export { InstallmentPlan, InstallmentPlanModel };
