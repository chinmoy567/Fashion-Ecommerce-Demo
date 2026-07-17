// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// OTP validity in minutes
export const OTP_VALIDITY = 10;
