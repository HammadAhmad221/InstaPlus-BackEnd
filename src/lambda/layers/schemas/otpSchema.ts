import mongoose, { Schema } from 'mongoose';

interface Otp {
  phoneNumber: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<Otp>({
  phoneNumber: { type: String },
  otp: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const OtpModel = mongoose.model<Otp>('Otp', otpSchema);

export { OtpModel };
