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
const {
    getAccommodation,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation
} = require('../controllers/accommodationController');

// CONTROLLERS
const {registerUser, loginUser, getAllUsers, getUserData, editUserData} = require('../controllers/userController');


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


// THIS CAN BE REMOVED
router.get('/accommodation', getAccommodation);
// POST a new accommodation
router.post('/accommodation', createAccommodation);
// UPDATE a single accommodation
router.patch('/accommodation/:id/:uId',updateAccommodation);

// DELETE a single accommodation
router.delete('/accommodation/:id', deleteAccommodation);


module.exports = router;

