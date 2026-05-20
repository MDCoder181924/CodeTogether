import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/Auth/User.js";

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails[0].value, })

                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        profilePic: profile.photos[0].value,
                        provider: "google",
                        isVerified: true,
                    })
                }

                return done(null, user);
            }
            catch (error) {
                return done(error, null);
            }
        }
    ))


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email,
                profilePic: profile.photos[0].value,
                provider: "github",
                isVerified: true,
            })
        }

        return done(null, user);
    }
    catch (error) {
        return done(error, null);
    }
}
))


export default passport;