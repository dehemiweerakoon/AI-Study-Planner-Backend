const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const { User } = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},

    async (accessToken, refreshToken, profile, done) => {
        try {
            //check if the user already exists via google id
            let user = await User.findOne({ googleId: profile.id });
            if (user) return done(null, user);

            // check if the user already exists via email
            const email = profile.emails[0].value;
            user = await User.findOne({ email: email });
            if (user) {
                // Link Google ID to existing account
                user.googleId = profile.id;
                await user.save();
                return done(null, user);
            }

            // create new user profile form google data
            user = new User({
                googleId: profile.id,
                firstName: profile.name.givenName || 'Google',
                lastName: profile.name.familyName || 'User',
                email: email,
                profileImage: profile.photos[0]?.value,
                role: 'user',
                isVerified: true // Google emails are pre-verified
            });
            await user.save();
            return done(null, user);

        } catch (err) {
            return done(err, null);
        }
    }
))