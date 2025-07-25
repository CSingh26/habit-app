const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return done(null, existingUser)
    } else {
        const newUserInfo = {
            name: profile.displayName,
            email,
            provider: 'google',
            socialId: profile.id
        }
        return done(null, newUserInfo) 
    }
}))
