const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/failed' }), async (req, res) => {
    const user = req.user;

    const existingUser = await require('../models/User').findOne({ email: user.email });

    if (existingUser) {
        return res.redirect(`yourapp://login-success`);
    } else {
        const query = `?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`;
        return res.redirect(`yourapp://social-signup${query}`);
    }
});

router.get('/failed', (req, res) => {
    res.status(401).json({ error: "Google authentication failed" });
});

module.exports = router;
