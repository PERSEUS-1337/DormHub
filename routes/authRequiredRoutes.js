/*

This should contain routes that needed authorization or routes that can only
be accessed if the user is currently logged-in in the system.

-V(BE)

*/

const express = require('express');
const router = express.Router();

// Authorization Checker
const requireAuth = require('../middleware/requireAuth');

// CONTROLLERS
const {registerUser, loginUser, getAllUsers, getUserData, editUserData} = require('../controllers/userController');
const { getAccommodation, createAccommodation, updateAccommodation, deleteAccommodation, addAccommodationToBookmark, deleteAccommodationOnBookmark} = require('../controllers/accommodationController');
const {getAllOwners, getOwner} = require('../controllers/ownerController')


router.use(requireAuth);

// SAMPLES
router.get('/hello', (req, res, next) => {res.json({msg: 'AUTHORIZED Hello World'});});
router.get('/all-users', getAllUsers);

// USER ROUTES
// GET user data
router.get('/user/:id', getUserData);
// UPDATE user data
router.patch('/user/:id', editUserData); 


// ACCOMMODATION ROUTES
// POST a new ACCOMMODATION
router.post('/accommodation', createAccommodation);
// UPDATE a single ACCOMMODATION
router.patch('/accommodation/:id/:uId',updateAccommodation);
// DELETE a single ACCOMMODATION
router.delete('/accommodation/:id/:uId', deleteAccommodation);
// ADD ACCOMMODATION to BOOKMARK
router.patch('/accommodation/bookmark/:id/:uId', addAccommodationToBookmark); 
// DELETE ACCOMMODATION from BOOKMARK
router.delete('/accommodation/bookmark/:id/:uId', deleteAccommodationOnBookmark); 

// OWNER
router.get('/owner/:id', getOwner);
router.get('/owners', getAllOwners);

module.exports = router;

