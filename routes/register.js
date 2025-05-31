import express from "express";
import RegisterModal from "../models/RegisterModal.js";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/verify-token.js";
import PhoneNumberModal from "../models/PhoneNumberModal.js";
import Authorization from "../middleware/authorization.js";
import otpStore from "../utlis/otpStores.js";

const router = express.Router();

router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const hashpassword = await bcrypt.hash(password, 12);
    console.log("hashpassword=>", hashpassword);

    const newUser = new RegisterModal({ email, password: hashpassword });
    await newUser.save();

    return res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
});

router.post("/email-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await RegisterModal.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }
    console.log("data ==> ", user);

    const hashpassword = await bcrypt.compare(password, user.password);
    if (!hashpassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("hashpassword=>", hashpassword);

    const token = jwt.sign(
      { id: user._id, email, hashpassword },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      data: {
        token,
        user: {
          id: user._id,
          email,
          hashpassword,
        },
      },
      msg: "User Login Successfully",
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/user-data", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  const user = await RegisterModal.findOne({ email });
  res.json({ exists: !!user });
});

router.post("/check-phone", async (req, res) => {
  const { phoneNo } = req.body;
  console.log(req.body)
  const user = await PhoneNumberModal.findOne({ phoneNo });
  res.json({ exists: !!user });
});

router.get("/register", async (req, res) => {
  try {
    const allUsers = await RegisterModal.find();
    res.status(200).json({
      message: "All Users Data",
      users: allUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/phoneuser", async (req, res) => {
  try {
    const { phoneNo, password, username } = req.body;
    console.log(req.body);

    const hashpassword = await bcrypt.hash(password, 12);
    console.log("hashpassword=>", hashpassword);

    const newUser = new PhoneNumberModal({
      phoneNo,
      password: hashpassword,
      username,
    });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

router.post("/skip", async (req, res) => {
  try {
    const { phoneNo, password, username } = req.body;
    console.log(req.body);

    const hashpassword = await bcrypt.hash(password, 12);
    console.log("hashpassword=>", hashpassword);

    const newUser = new PhoneNumberModal({
      phoneNo,
      password: hashpassword,
      username,
    });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

router.post("/login-phone", async (req, res) => {
  const { phoneNo, password } = req.body;
  console.log(phoneNo, password);
  try {
    const user = await PhoneNumberModal.findOne({ phoneNo });
    console.log(user);

    if (!user) {
      return res.status(500).json({ message: "Invalid Phone Number" });
    }

    const hashpassword = await bcrypt.compare(password, user.password);
    console.log(hashpassword);
    if (!hashpassword) {
      return res.status(500).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { id: user._id, phoneNo, hashpassword },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({
      data: {
        token,
        user: {
          id: user._id,
          phoneNo,
          hashpassword,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/reset-password", async (req, res) => {
  const { phoneNo, otp, newPassword } = req.body;
  console.log(req.body)
  const storedOtp = otpStore[phoneNo];

  console.log(storedOtp);
  if (!storedOtp) {
    return res
      .status(400)
      .json({ message: "OTP not found. Please try again." });
  }

    if (Date.now() > storedOtp.expiresAt) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    if (String(storedOtp.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

  try {
    const user = await PhoneNumberModal.findOne({ phoneNo });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    delete otpStore[phoneNo]; // clear OTP

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
});

router.get("/login-phonetoken", Authorization, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
  