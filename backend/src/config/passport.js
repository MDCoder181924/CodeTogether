import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/Auth/User.js";

const backendUrl = (process.env.BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");

// Only initialize Google OAuth Strategy if credentials are present to prevent server crash on missing env vars
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${backendUrl}/api/auth/google/callback`
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) return done(new Error("No email found from Google profile"), null);

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName || "Google User",
                        email,
                        profilePic: profile.photos?.[0]?.value || "",
                        provider: "google",
                        isVerified: true,
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        })
    );
}

// Only initialize GitHub OAuth Strategy if credentials are present to prevent server crash on missing env vars
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
        new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${backendUrl}/api/auth/github/callback`
        }, 
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName || profile.username,
                        email,
                        profilePic: profile.photos?.[0]?.value || "",
                        provider: "github",
                        isVerified: true,
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        })
    );
}

export default passport;