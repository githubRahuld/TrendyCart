import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
            scope: ["profile", "email"],
        },
        function (accessToken, refreshToken, profile, callback) {
            // Include accessToken and refreshToken with the user object
            const userWithTokens = {
                ...profile,
                accessToken,
                refreshToken,
            };

            console.log("Google Profile with Tokens:", userWithTokens);

            // Pass the modified user object to Passport's callback
            callback(null, userWithTokens);
        }
    )
);

// Serialize User
passport.serializeUser((user, done) => {
    // Serialize the full user object, including tokens
    done(null, user);
});

// Deserialize User
passport.deserializeUser((user, done) => {
    // Deserialize the user object
    done(null, user);
});

export default passport;
