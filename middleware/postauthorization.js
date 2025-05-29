import jwt from "jsonwebtoken";

const PostAuthorization = async (req, res, next) => {
  const bearerToken = req?.headers?.authorization;
  let token = bearerToken?.split(" ")[1];

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.exp * 1000 < Date.now()) {
        return res.status(500).json({ message: "Token is Expired" });
      }

      req.user = decoded;
      return next();
    }

    if (req.session && req.session.user) {
      req.user = req.session.user;
      return next();
    }

    return res
      .status(402)
      .json({ message: "Token or session is not provided" });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token or session", error: error.message });
  }
};

export default PostAuthorization