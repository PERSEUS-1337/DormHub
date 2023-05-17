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
const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserData,
    editUserData,
    getBookmarkUser,
    addToBookmarkUser,
    deleteBookmarkUser
} = require('../controllers/userController');

const {
    getAllOwners, 
    getOwner,
    getBookmarkOwner,
    addToBookmarkOwner,
    deleteBookmarkOwner
} = require('../controllers/ownerController');

const {
    getAccommodation,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation
} = require('../controllers/accommodationController');

router.use(requireAuth);

// SAMPLES
router.get('/hello', (req, res, next) => {res.json({msg: 'AUTHORIZED Hello World'});});
router.get('/users', getAllUsers);
router.get('/owners', getAllOwners);

/*
    uId = userId
    id = accommodationId
*/

// USER ROUTES
// GET user data
router.get('/user/:uId', getUserData);
// UPDATE user data
router.patch('/user/:uId', editUserData); 
// GET bookmarks
router.get('/user/bookmark/:uId', getBookmarkUser)
// ADD a bookmark
router.patch('/user/bookmark/:id/:uId', addToBookmarkUser); 
// DELETE bookmark
router.delete('/user/bookmark/:id/:uId', deleteBookmarkUser); 

// OWNER
// GET owner data
router.get('/owner/:oId', getOwner);
// GET bookmarks
router.get('/owner/bookmark/:oId', getBookmarkOwner)
// UPDATE user data
router.patch('/user/:uId', editUserData); 
// ADD a bookmark
router.patch('/owner/bookmark/:id/:oId', addToBookmarkOwner); 
// DELETE bookmark
router.delete('/owner/bookmark/:id/:oId', deleteBookmarkOwner); 

// ACCOMMODATION ROUTES
// POST a new ACCOMMODATION
router.post('/accommodation', createAccommodation);
// UPDATE a single ACCOMMODATION
router.patch('/accommodation/:id/:oId',updateAccommodation);
// DELETE a single ACCOMMODATION
router.delete('/accommodation/:id/:oId', deleteAccommodation);

module.exports = router;