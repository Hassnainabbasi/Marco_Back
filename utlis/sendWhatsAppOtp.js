import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendSmsOtp = async (phoneNo, otp) => {
  const formattedPhone = `whatsapp:+${phoneNo}`;
  
 const message = await client.messages.create({
   body: `Your OTP is: ${otp}`,
   from: "whatsapp:+14155238886",
   to: `whatsapp:${phoneNo}`,
 });
};
