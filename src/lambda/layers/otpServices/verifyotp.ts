import { UserModel } from '../schemas/userSchema';
import { OtpModel } from '../schemas/otpSchema';
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';

const sns = new AWS.SNS();

export const verifyOTPAndGenerateToken = async (
  phoneNumber: string,
  otp: string
): Promise<{ token: string; user: any } | { verification: boolean }> => {
  try {
    const latestOtp = await OtpModel.findOne({ phoneNumber }).sort({ createdAt: -1 });
    if (!latestOtp) {
      // Handle the case when no OTP record is found
      return { verification: false };
    }
    let diff=(new Date().getTime()- latestOtp.createdAt.getTime());

    if(diff>(60*1000*3)){
      //return token expired
        return { verification: false };
    }  
    if (latestOtp && latestOtp.otp === otp) {
      const token = generateToken(latestOtp);
      let user = await UserModel.findOne({ phoneNumber });
      if (!user) {
        user = new UserModel({ phoneNumber });
        await user.save();
      }
      return { token, user: latestOtp };
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
  const token = jwt.sign(payload, 'sir_amaar', { expiresIn: '1h' });
  return token;
};

