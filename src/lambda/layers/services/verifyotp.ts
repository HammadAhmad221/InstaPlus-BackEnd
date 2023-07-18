/*import { UserModel } from '../schemas/userSchema';
import { OtpModel } from '../schemas/otpSchema';
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';

const sns = new AWS.SNS();

export const verifyOTPAndGenerateToken = async (
  phoneNumber: string,
  otp: string
): Promise<{ token: string; record: any } | { verification: boolean }> => {
  try {
    const user = await UserModel.findOne({ phoneNumber });
 if (user) {
      const latestOTP = await OtpModel.findOne({ phoneNumber, otp }).sort({ createdAt: -1 }).limit(1);

 if (latestOTP&&latestOTP.otp===otp) {
        const token = generateToken(user);
        console.log("token from verify otp", token );
        console.log("user after verificatrion",user);
        return { token, record: user };
      }
    }
    // Verification failed
   return { verification: false };
  } catch (error) {
    throw error;
  }
};

const generateToken = (user: any): string => {
  const { _id, phoneNumber } = user;
  const payload = { _id, phoneNumber };
  const token = jwt.sign(payload, "sufi1234", { expiresIn: '1h' });
  return token;
};*/


import { UserModel } from '../schemas/userSchema';
import { OtpModel } from '../schemas/otpSchema';
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';

const sns = new AWS.SNS();

export const verifyOTPAndGenerateToken = async (
  phoneNumber: string,
  otp: string
): Promise<{ token: string; record: any } | { verification: boolean }> => {
  try {
    let user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      user = new UserModel({ phoneNumber });
      await user.save();
    }

    const latestOtp = await OtpModel.findOne({ phoneNumber }).sort({ createdAt: -1 });

    if (latestOtp && latestOtp.otp === otp && latestOtp.createdAt.getTime()) {
      const token = generateToken(user);
      return { token, record: user };
    }

    // Verification failed
    return { verification: false };
  } catch (error) {
    throw error;
  }
};

const generateToken = (user: any): string => {
  const { _id, phoneNumber } = user;
  const payload = { _id, phoneNumber };
  const token = jwt.sign(payload, "sufi1234", { expiresIn: '1h' });
  return token;
};

