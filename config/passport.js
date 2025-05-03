import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import ContinueGoogleModel from "../models/ContinueGoogleModels.js";
import FacebookModel from "../models/FacebookModal.js";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  ContinueGoogleModel.findById(id).then((user) => done(null, user));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true, 
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const mode = req.query.state; 

      try {
        const existingUser = await ContinueGoogleModel.findOne({
          googleId: profile.id,
        });

        if (mode === "login") {
          if (existingUser) return done(null, existingUser);
          return done(null, false, { message: "User not found" });
        }

        if (mode === "join") {
          if (existingUser) return done(null, existingUser); // already exists
          const newUser = await ContinueGoogleModel.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          });
          return done(null, newUser);
        }

        return done(null, false, { message: "Invalid mode" });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const mode = req.query.state;

      try {
        const existingUser = await FacebookModel.findOne({
          facebookId: profile.id,
        });

        if (mode === "login") {
          if (existingUser) return done(null, existingUser);
          return done(null, false, { message: "User not found" });
        }

        if (mode === "join") {
          if (existingUser) return done(null, existingUser); // already exists
          const newUser = await FacebookModel.create({
            facebookId: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value,
            photo: profile.photos?.[0]?.value,
          });
          return done(null, newUser);
        }

        return done(null, false, { message: "Invalid mode" });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
