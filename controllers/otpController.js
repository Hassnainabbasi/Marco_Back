import PhoneNumberModal from "../models/PhoneNumberModal.js";
import otpStore from "../utlis/otpStores.js";
import { sendSmsOtp } from "../utlis/sendWhatsAppOtp.js";
import bcrypt from "bcrypt";


export const sendOtpController = async (req, res) => {
  const { phoneNo } = req.body;
  if (!phoneNo) {
    return res.status(400).json({ message: "Phone number is required" });
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  const expiresAt = Date.now() + 5 * 60 * 1000;

  try {
    await sendSmsOtp(phoneNo, otp);

    otpStore[phoneNo] = {otp, expiresAt}
    console.log(otpStore,"yeh hy man jar")
    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP via UltraMsg:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtpController = async (req, res) => {
  const { phoneNo, otp, password } = req.body;
  console.log(req.body, "request ayee");
  const storedOtp = otpStore[phoneNo];
  console.log("save=>", storedOtp);

  if (!storedOtp) {
    return res
      .status(400)
      .json({ message: "OTP not generated. Please request OTP first." });
  }

  if (storedOtp.otp === Number(otp)) {
    delete otpStore[phoneNo];
    return res.status(200).json({ message: "OTP verified successfully!" });
  }

  return res.status(400).json({ message: "Incorrect OTP. Please try again." });
};
