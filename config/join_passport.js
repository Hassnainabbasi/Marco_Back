import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import ContinueGoogleModel from "../models/ContinueGoogleModels.js";
import dotenv from "dotenv";
import AllUsers from "../models/AllUserModel.js";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  AllUsers.findById(id).then((user) => done(null, user));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await AllUsers.findOne({
          googleId: profile.id,
        });
        if (existingUser) return done(null, existingUser);

        const newUser = await AllUsers.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
        });

        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
    