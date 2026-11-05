
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

export const configurePassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL;

  if (!clientID || !clientSecret || !callbackURL) {
    throw new Error("Google OAuth environment variables are missing");
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        state: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.trim().toLowerCase();
          const emailVerified = profile._json.email_verified === true;

          if (!email || !emailVerified) {
            return done(null, false, {
              message: "Google email is missing or not verified",
            });
          }

          // Find an account already connected to this Google ID.
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
    return done(null, {
        userId: user._id.toString(),
        role: user.role,
    });
}

          // Check whether this email already belongs to an account.
          user = await User.findOne({ email });

          if (user) {
            if (user.googleId && user.googleId !== profile.id) {
              return done(null, false, {
                message: "This email is connected to another Google account",
              });
            }

            // Link the verified Google account to the existing user.
            user.googleId = profile.id;
            await user.save();

            return done(null, {
            userId: user._id.toString(),
            role: user.role,
          });
          }

          // Create a new Google-authenticated buyer.
          const newUser = await User.create({
            name: profile.displayName || email.split("@")[0],
            email,
            googleId: profile.id,
            role: "buyer",
          });

          return done(null, {
         userId: newUser._id.toString(),
         role: newUser.role,
        });
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
};
