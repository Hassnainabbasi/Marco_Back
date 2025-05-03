import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  facebookId: { type: String },
  displayName: String,
  email: String,
  photo: String,
});

const FacebookModel = mongoose.model("facebook_user", UserSchema);
export default FacebookModel;