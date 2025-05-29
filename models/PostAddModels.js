import mongoose from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    userId: { type: String },
    make: { type: String },
    title: { type: String },
    description: { type: String },
    location: { type: String },
    price: { type: String },
    name: { type: String },
    phoneNumber: { type: String },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const PostModels = mongoose.model("postmodels", PostSchema);

export default PostModels;
