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
const { getAccommodation, createAccommodation, updateAccommodation, deleteAccommodation} = require('../controllers/accommodationController');
const {getAllOwners, getOwner} = require('../controllers/ownerController')
const {getBookmark, addAccommodationToBookmark, deleteAccommodationOnBookmark} = require('../controllers/bookmarkController')

router.use(requireAuth);

// SAMPLES
router.get('/hello', (req, res, next) => {res.json({msg: 'AUTHORIZED Hello World'});});
router.get('/all-users', getAllUsers);

/*
    uId = userId
    id = accommodationId
*/


// USER ROUTES
// GET user data
router.get('/user/:uId', getUserData);
// UPDATE user data
router.patch('/user/:uId', editUserData); 

// GET BOOKMARKS COMPLETE WITH INFO
router.get('/user/bookmark/:uId', getBookmark)
// ADD A BOOKMARK
router.patch('/user/bookmark/:id/:uId', addAccommodationToBookmark); 
// DELETE ACCOMMODATION from BOOKMARK
router.delete('/user/bookmark/:id/:uId', deleteAccommodationOnBookmark); 

// ACCOMMODATION ROUTES
// POST a new ACCOMMODATION
router.post('/accommodation', createAccommodation);
// UPDATE a single ACCOMMODATION
router.patch('/accommodation/:id/:uId',updateAccommodation);
// DELETE a single ACCOMMODATION
router.delete('/accommodation/:id/:uId', deleteAccommodation);
// ADD ACCOMMODATION to BOOKMARK

// OWNER
router.get('/owner/:id', getOwner);
router.get('/owners', getAllOwners);

module.exports = router;

