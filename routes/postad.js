import express from "express";
import PostModels from "../models/PostAddModels.js";
import cors from 'cors'
import PostAuthorization from "../middleware/postauthorization.js";

const router = express.Router();

router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

router.use(express.json())

router.post("/createadd",PostAuthorization, async (req, res) => {
  console.log(req)
   const userId = req.user.id
   console.log(userId, 'ids')
  try {
    const {
      make,
      title,
      description,
      location,
      price,
      name,
      phoneNumber,
      images,
    } = req.body;

    console.log(req.body);
    const user = new PostModels({
      userId,
      make,
      title,
      description,
      location,
      price,
      name,
      phoneNumber,
      images,
    });

    await user.save();
    return res.status(201).json({ message: "Ad created successfully", post :user
      });
  } catch (error) {
    console.error("Error saving user:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

export default router;
