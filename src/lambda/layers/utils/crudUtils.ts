import { Document, Model } from 'mongoose';

// Function to create a document
export async function create<T extends Document>(
  model: Model<T>,
  data: Partial<T>
): Promise<T> {
  const newDocument = new model(data);
  return newDocument.save();
}

// Function to update a document by ID
export async function update<T extends Document>(
  model: Model<T>,
  id: string,
  data: Partial<T>
): Promise<T | null> {
  return model.findByIdAndUpdate(id, data, { new: true });
}

// Function to delete a document by ID
export async function del<T extends Document>(
  model: Model<T>,
  id: string
): Promise<T | null> {
  return model.findByIdAndDelete(id);
}
