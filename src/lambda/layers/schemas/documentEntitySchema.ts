import mongoose, { Schema, Model,Types, Document } from 'mongoose';

// Define the inner schema for Validity
interface Validity {
  from: Date;
  to: Date;
}

// Define the Document interface representing the document
interface DocumentEntity extends Document{
  name: string;
  type: number;
  frontPhoto: string;
  backPhoto: string;
  description: string;
  validity: Validity;
  userID: Types.ObjectId; // User ID
  ownerID: Types.ObjectId; // User ID
  created: Date;
  updated: Date;
}

// Define the Validity schema
const validitySchema: Schema<Validity> = new Schema<Validity>({
  from: {
    type: Date,
//    required: true,
  },
  to: {
    type: Date,
  //  required: true,
  },
});

// Define the Document schema
const documentSchema: Schema<DocumentEntity> = new Schema<DocumentEntity>({
  name: {
    type: String,
    //required: true,
  },
  type: {
    type: Number,
//    required: true,
  },
  frontPhoto: {
    type: String,
  //  required: true,
  },
  backPhoto: {
    type: String,
    //required: true,
  },
  description: {
    type: String,
//    required: true,
  },
  validity: {
    type: validitySchema,
  //  required: true,
  },
  userID: {
    type: Schema.Types.ObjectId, ref:"User"
    //required: true,
  },
  ownerID: {
    type: Schema.Types.ObjectId,ref:"User"
//    required: true,
  },
  created: {
    type: Date,
  //  required: true,
    default: Date.now,
  },
  updated: {
    type: Date,
    //required: true,
    default: Date.now,
  },
});

// Create and export the Document model
const DocumentModel: Model<DocumentEntity> = mongoose.model<DocumentEntity>('Document', documentSchema);

export { DocumentEntity , DocumentModel };
