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
interface Plan extends Document {
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
});

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
});

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
});

// Define the Installment Plan schema
const PlanSchema: Schema<Plan> = new Schema<Plan>({
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
    type: Schema.Types.ObjectId,ref:'User'
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
const PlanModel: Model<Plan> = mongoose.model<Plan>('Plan', PlanSchema);
export { Plan, PlanModel };