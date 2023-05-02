const express = require('express');
const router = express.Router();

// MODEL
const User = require('../models/User');

// CONTROLLERS
const {registerUser, loginUser, getAllUsers, getUserData} = require('../controllers/userController');

router.get('/hello', (req, res, next) => {
    res.json({msg: 'Hello World'})
});

router.get('/all-users', getAllUsers);

// // POST: Register a user
router.post('/register', registerUser);

router.post('/login', loginUser);


// UPDATE an accommodation
router.patch('/update-user', (req, res, next) => {
    res.json({msg: 'UPDATE a user'})
});

module.exports = router;