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
const {registerUser, loginUser, getAllUsers, getUserData, editUserData} = require('../controllers/userController');
const {getAllOwners, getOwner} = require('../controllers/ownerController')

router.use(requireAuth);

router.get('/hello', (req, res, next) => {
    res.json({msg: 'AUTHORIZED Hello World'});
});

router.get('/all-users', async (req, res) => {
    const all = await User.find({});
    res.json({msg: all})
});


router.get('/user-data/:id', getUserData);

router.patch('/edit-user/:id', editUserData); 


// OWNER
router.get('/owner/:id', getOwner);
router.get('/owners', getAllOwners);

module.exports = router;

