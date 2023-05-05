const express = require('express');
const router = express.Router();

// MODEL
const User = require('../models/User');

// CONTROLLERS
const {registerUser, loginUser, getAllUsers} = require('../controllers/userController');

// SAMPLES -- can be deleted
router.get('/hello', (req, res, next) => {
    res.json({msg: 'Hello World'})
});

// USER PRE-AUTH routes
// POST: User Registration
router.post('/register', registerUser);
// POST: User Login
router.post('/login', loginUser);


module.exports = router;