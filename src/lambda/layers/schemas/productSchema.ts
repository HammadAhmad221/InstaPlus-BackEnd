import mongoose, { Schema, Model, Document,Types } from 'mongoose';

// Define the inner schema for the Warranty
interface Warranty {
  type: number;
  duration: {
    type: number;
    value: number;
  };
  description: string;
}

// Define the Product interface representing the document
interface Product extends Document {
  name: string;
  model: string;
  size: string;
  Manufacturer: string;
  Warranty: Warranty;
  productPicture: string;
  author: Types.ObjectId; // Use the correct type here
  created: Date;
  updated: Date;
}

// Define the Warranty schema
const warrantySchema: Schema<Warranty> = new Schema<Warranty>({
  type: {
    type: Number,
//    required: true,
  },
  duration: {
    type: {
      type: Number,
  //    required: true,
    },
    value: {
      type: Number,
    //  required: true,
    },
  },
  description: {
    type: String,
//    required: true,
  },
});

// Define the Product schema
const productSchema: Schema<Product> = new Schema<Product>({
  name: {
    type: String,
    //required: true,
  },
  model: {
    type: String,
    //required: true,
  },
  size: {
    type: String,
    //required: true,
  },
  Manufacturer: {
    type: String,
    //required: true,
  },
  Warranty: {
    type: warrantySchema,
    //required: true,
  },
  productPicture: {
    type: String,
   // required: true,
  },
  author: {
    type: Schema.Types.ObjectId,ref:"User"
   // required: true,
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

// Create and export the Product model
const ProductModel: Model<Product> = mongoose.model<Product>('Product', productSchema);

export { Product, ProductModel };
