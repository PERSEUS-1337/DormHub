/**
 * 
 * This should contain routes that needed authorization or routes that can only
 * be accessed if the user is currently logged in in the system.
 * 
 * 
 * This is a TEMPORARY file.
 * 
 * 
 * -V (BE)
 */


const User = require('../models/User');
const express = require('express');
const router = express.Router();

const requireAuth = require('../middleware/requireAuth');

// CONTROLLERS
const {registerUser, loginUser, getAllUsers, getUserData} = require('../controllers/userController');


router.use(requireAuth);

router.get('/hello', (req, res, next) => {
    res.json({msg: 'AUTHORIZED Hello World'});
});

router.get('/all-users', async (req, res) => {
    const all = await User.find({});
    res.json({msg: all})
});

router.get('/user-data', getUserData);

module.exports = router;

