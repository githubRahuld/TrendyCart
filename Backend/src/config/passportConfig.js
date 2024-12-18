import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model"; // Import your User model

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
            scope: ["profile", "email"],
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                // Check if user already exists in the database
                let user = await User.findOne({ googleId: profile.id });
                console.log("User info in google: ", user);

                if (!user) {
                    // If the user does not exist, create a new user
                    user = new User({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        fullName: profile.displayName,
                        avatar: profile.photos[0].value,
                        accessToken: accessToken, // Store refresh token
                        refreshToken: refreshToken, // Store refresh toke
                    });
                    await user.save();
                    console.log("User info in google: ", user);
                } else {
                    // Update tokens if the user exists
                    user.accessToken = accessToken;
                    user.refreshToken = refreshToken;

                    await user.save();
                    console.log("User info in google: ", user);
                }

                // Pass the user object to the `done` function
                done(null, user);
            } catch (err) {
                console.error("Error in Google Strategy:", err);
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize user ID for session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Fetch user from DB using the ID
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
