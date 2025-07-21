import userModel from "../models/userModel.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await userModel.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          return done(null, {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
          });
        }

        const newUser = await userModel.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: "", 
          role: "candidate",
          profileImage: {
            url: profile.photos[0].value,
            public_id: null,
          },
        });

        return done(null, {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        });
      } catch (error) {
        console.error("Google auth error:", error);
        return done(error, null);
      }
    }
  )
);
