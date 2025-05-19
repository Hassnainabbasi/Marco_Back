import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendSmsOtp = async (phoneNo, otp) => {
  const formattedPhone = `whatsapp:+${phoneNo}`;
  
  console.log(`Account SID: '${process.env.TWILIO_ACCOUNT_SID}'`);
  console.log(`Auth Token: '${process.env.TWILIO_AUTH_TOKEN}'`);

  const message = await client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: "whatsapp:+14155238886",
    to: `whatsapp:${phoneNo}`,
  });
};
