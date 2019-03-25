const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Get post model
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')

// Get validation
const validatePostInput = require('../../validation/post')

// @router  GET api/posts/test
// @desc    Test Post route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "Posts Works"
}));

// @router  GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @router  GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: 'No post found with that id' }));
});


// @router  POST api/posts
// @desc    Create a new post
// @access  Private

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
        res.status(400).json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save()
        .then(post => res.json(post));
});

// @router  DELETE api/posts/:id
// @desc    Delete a post by id
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notauthorized: 'User not authorized' });
                    }

                    // Delete post
                    post.remove()
                        .then(() => res.json({ success: true }));

                })
                .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }))
        })
});


module.exports = router;