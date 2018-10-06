const config = require('../private/config.json');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await User.findById(id);
        done(null, user);
    } catch (e) {
        done();
    }
});

passport.use(
    new GoogleStrategy({
        callbackURL: '/auth/google/redirect',
        clientID: config.google.client,
        clientSecret: config.google.secret
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        let currentUser = await User.findOne({id:profile.id})
        if(currentUser) {
            done(null, currentUser);
        } else {
            let newUser = await new User({
                googleId: profile.id,
                displayName: profile.displayName,
                emails: profile.emails,
                name: profile.name,
                photos: profile.photos,
                provider: profile.provider,
                gender: profile.gender
            }).save();
            done(null, newUser);
        }
    })
);