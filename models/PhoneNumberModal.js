import mongoose from "mongoose";

const { Schema } = mongoose;

const registerSchema = new Schema(
  {
    phoneNo: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    username: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const PhoneNumberModal = mongoose.model("phoneno", registerSchema);

export default PhoneNumberModal;
