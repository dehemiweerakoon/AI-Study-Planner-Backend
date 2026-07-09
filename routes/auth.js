const { User, validateAuth } = require('../models/user');
const express = require('express');
const routes = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const passport = require('passport');
require('../config/passport');

routes.post('/', async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid User Or Password");

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send('Invalid user or Password');

    const token = user.generateAuthToken();

    res.header('x-auth-token',token).send(_.pick(user,['firstName','email','_id']));
    
})

// 1. Kickstart Google login
routes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// 2. Google callback handler
routes.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Passport maps your database user into req.user
        const token = req.user.generateAuthToken();

        // Redirect back to frontend application with token appended as a query parameter
        // For production, use secure cross-domain cookies or secure deep links
        res.redirect(`http://localhost:3000/api/auth/test-success?token=${token}`);
    }
);

routes.get('/login-page', (req, res) => {
    res.send(`
        <html>
            <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
                <h2>AI Study Planner Login</h2>
                <a href="/api/auth/google" 
                    style="background: #4285F4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Sign in with Google
                </a>
            </body>
        </html>
    `);
});

// 2. Catch the token and display it on screen after authorization
routes.get('/test-success', (req, res) => {
    const token = req.query.token;
    res.send(`
        <html>
            <body style="font-family: Arial, sans-serif; margin: 40px;">
                <h2 style="color: green;">✓ Authentication Successful!</h2>
                <p><strong>Your JWT Token:</strong></p>
                <textarea style="width: 100%; height: 100px; padding: 10px;" readonly>${token}</textarea>
                <p style="color: gray; margin-top: 20px;">Copy this token and use it as your 'x-auth-token' header to access protected routes like /api/user/me</p>
            </body>
        </html>
    `);
});

module.exports = routes;