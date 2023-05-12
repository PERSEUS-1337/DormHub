const express = require('express');
const router = express.Router();

// MODEL
const User = require('../models/User');

// CONTROLLERS
const {registerUser, loginUser, getAllUsers, getUserData} = require('../controllers/userController');
const {register} = require('../controllers/genController');
const {registerOwner} = require('../controllers/ownerController');

router.get('/hello', (req, res, next) => {
    res.json({msg: 'Hello World'})
});

router.get('/all-users', getAllUsers);

// // POST: Register 
router.post('/register', register);

// // POST: Register a user
router.post('/register/user', registerUser);
// // POST: Register a user
router.post('/register/owner', registerOwner);

router.post('/login', loginUser);


// UPDATE an accommodation
router.patch('/update-user', (req, res, next) => {
    res.json({msg: 'UPDATE a user'})
});

module.exports = router;