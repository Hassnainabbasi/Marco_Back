
import express from "express";
import passport from "passport";
import querystring from "querystring";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();

const getGoogleAuthUrl = (mode) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: "http://localhost:3000/auth/google/callback",
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "select_account",
    scope: ["profile", "email"].join(" "),
    state: mode, 
  };

  return `${rootUrl}?${querystring.stringify(options)}`;
};

const getFacebookAuthUrl = (mode) => {
  const rootUrl = "https://www.facebook.com/v17.0/dialog/oauth";
  const options = {
    client_id: process.env.FB_CLIENT_ID,
    redirect_uri: "http://localhost:3000/auth/facebook/callback",
    state: mode,
    scope: "email",
  };

  return `${rootUrl}?${querystring.stringify(options)}`;
};

router.post("/google/join", (req, res) => {
  const url = getGoogleAuthUrl("join");
  res.json({ url });
});

router.post("/google/login", (req, res) => {
  const url = getGoogleAuthUrl("login");
  res.json({ url });
});

router.post("/facebook/join", (req, res) =>
  res.json({ url: getFacebookAuthUrl("join") })
);
router.post("/facebook/login", (req, res) =>
  res.json({ url: getFacebookAuthUrl("login") })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login?error=true", 
    session: true,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/");
  }
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "http://localhost:5173/login?error=true",
    session: true,
  }),
  (req, res) => res.redirect("http://localhost:5173/")
);

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }
  res.status(401).json({ message: "Not logged in" });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out" });
    });
  });
});

export default router;
