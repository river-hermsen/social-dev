const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load profile modal
const Profile = require('../../models/Profile');
// Load User modal
const User = require('../../models/User');

// @router  GET api/profile/test
// @desc    Test Profile route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "Profile Works"
}));

// @router  GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors)
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json(err))
});


module.exports = router;