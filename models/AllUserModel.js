// models/UserModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  phoneNo: { type: String, unique: true, sparse: true },
  password: { type: String },
  username: { type: String },
  name: { type: String },
  provider: {
    type: String,
    enum: ["local", "google", "facebook", "phone", "guest"],
    default: "local",
  },
  googleId: { type: String },
  facebookId: { type: String },
  photo: { type: String },
});

const AllUsers = mongoose.model("AllUser", userSchema);

export default AllUsers