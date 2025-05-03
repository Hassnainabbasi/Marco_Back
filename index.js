import express from "express";
import mongoose from "mongoose";
import registerRoutes from './routes/register.js'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import { sendOtpController, verifyOtpController } from "./controllers/otpController.js";
import passport from "passport";
import dotenv from "dotenv";
import './config/passport.js'
import session from "express-session";

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use("/users", registerRoutes)
app.post('/send-otp', sendOtpController)
app.post("/verify-otp", verifyOtpController);


app.use(
  session({
    secret: "mydevsecret123", 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth',authRoutes)

app.get("/", (req, res) => {  
  res.send("Hello from ES Modules Express!");
});

mongoose
  .connect("mongodb+srv://hassnainabbasin187:1412@apis.grbet.mongodb.net/Marco")
  .then(() => {
    console.log("Db is Connect");
  })
  .catch((err) => console.log(err));
  
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
