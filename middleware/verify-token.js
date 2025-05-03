import jwt from "jsonwebtoken";
import RegisterModal from "../models/RegisterModal.js";

const verifyToken = async (req, res, next) => {
  try {
    const bearerToken = req?.headers?.authorization;

    const token = bearerToken?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ message: "Token expired" });
    }

    if (decoded) {
      const user = await RegisterModal.findById(decoded.id).lean();
      if (!user) {
        return res.status(404).json({ message: "No section user found!" });
      }
      req.user = user;
      next();
      return;
    }

    return res.status(401).json({ message: "Something went wrong!" });
  } catch (err) {
    return res.status(401).json({ message: "Something went wrong!" });
  }
};

export default verifyToken;
