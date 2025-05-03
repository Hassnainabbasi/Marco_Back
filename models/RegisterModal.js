import mongoose from "mongoose";

const { Schema } = mongoose;

const registerSchema = new Schema(
  {
    email : { type: String, require: true },
    password: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const RegisterModal = mongoose.model("register", registerSchema);

export default RegisterModal;
