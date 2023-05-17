const express = require('express');
const router = express.Router();

// CONTROLLERS
const {registerUser, loginUser, getAllUsers, getUserData} = require('../controllers/userController');
const {registerOwner, loginOwner, getAllOwners} = require('../controllers/ownerController');

// SAMPLE: Get data to test
router.get('/users', getAllUsers);
router.get('/owners', getAllOwners);

// POST: Register a user
router.post('/register/user', registerUser);

// POST: Register an owner
router.post('/register/owner', registerOwner);

router.post('/login/user', loginUser);
router.post('/login/owner', loginOwner);

module.exports = router; 