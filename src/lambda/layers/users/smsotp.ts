import { UserModel } from './user';
import AWS from 'aws-sdk';

const sns = new AWS.SNS();

export const sendOTP = async (phoneNumber: string): Promise<void> => {
  try {
    const user = await UserModel.findOne({ phoneNumber });

    if (user) {
      // User exists, send OTP to the phone number
      const otp = generateOTP();
      await sendOTPToPhoneNumber(phoneNumber, otp);
    } else {
      // User doesn't exist, save the phone number and send OTP
      const newUser = new UserModel({ phoneNumber });
      await newUser.save();
      const otp = generateOTP();
      await sendOTPToPhoneNumber(phoneNumber, otp);
    }
  } catch (error) {
    throw error;
  }
};

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPToPhoneNumber = async (phoneNumber: string, otp: string): Promise<void> => {
  const params = {
    Message: `Your OTP: ${otp}`,
    PhoneNumber: phoneNumber,
  };

  try {
    await sns.publish(params).promise();
    console.log('SMS sent successfully.');
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }
};
